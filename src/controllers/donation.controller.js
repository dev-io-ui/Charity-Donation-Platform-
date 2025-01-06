const { Donation, User, Charity } = require('../models');
const Razorpay = require('razorpay');
const { sendDonationConfirmation } = require('../utils/email');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');

// Debug: Log environment variables
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);

// Initialize Razorpay only if keys are present
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay keys are missing in environment variables!');
}

const razorpay = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}) : null;

// Create Razorpay order
exports.createDonationOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({ message: "Payment service not configured" });
    }

    const { amount, charityId } = req.body;

    // Verify charity exists and is approved
    const charity = await Charity.findOne({
      where: { id: charityId, isApproved: true }
    });
    if (!charity) {
      return res.status(404).json({ message: "Charity not found or not approved" });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `don_${Date.now()}`,
      notes: {
        charityId: charityId,
        userId: req.userId
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: err.message });
  }
};

// Verify and complete donation
exports.verifyDonation = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      charityId
    } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amount = payment.amount / 100; // Convert paise to rupees

    // Create donation record
    const donation = await Donation.create({
      amount,
      UserId: req.userId,
      CharityId: charityId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'completed'
    });

    // Update charity's current amount
    const charity = await Charity.findByPk(charityId);
    await charity.increment('currentAmount', { by: amount });

    // Send confirmation email
    const user = await User.findByPk(req.userId);
    await sendDonationConfirmation(user.email, {
      amount,
      charityName: charity.name,
      donationId: donation.id
    });

    res.json({
      message: "Donation successful",
      donation
    });
  } catch (err) {
    console.error('Error verifying donation:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { UserId: req.userId },
      include: [
        { model: Charity, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(donations);
  } catch (err) {
    console.error('Error fetching donation history:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      where: { 
        id: req.params.id,
        UserId: req.userId
      },
      include: [
        { model: Charity, attributes: ['name'] },
        { model: User, attributes: ['name', 'email'] }
      ]
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Create PDF receipt
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=donation_receipt_${donation.id}.pdf`);
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(20).text('Donation Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Receipt Number: ${donation.id}`);
    doc.text(`Date: ${donation.createdAt.toLocaleDateString()}`);
    doc.text(`Donor: ${donation.User.name}`);
    doc.text(`Email: ${donation.User.email}`);
    doc.moveDown();
    doc.text(`Charity: ${donation.Charity.name}`);
    doc.text(`Amount: ₹${donation.amount}`);
    doc.text(`Payment ID: ${donation.paymentId}`);
    doc.text(`Order ID: ${donation.orderId}`);
    doc.moveDown();
    doc.text('Thank you for your generous donation!');

    doc.end();
  } catch (err) {
    console.error('Error generating donation receipt:', err);
    res.status(500).json({ message: err.message });
  }
};
