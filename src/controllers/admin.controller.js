const { User, Charity, Donation } = require('../models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const config = require('../config/database.js').development;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCharities = async (req, res) => {
  try {
    const charities = await Charity.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Approve or reject charity
// exports.approveCharity = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, comments } = req.body;

//     // Validate status
//     if (!['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ message: "Status must be either 'approved' or 'rejected'" });
//     }

//     // Find charity
//     const charity = await Charity.findByPk(id);
//     if (!charity) {
//       return res.status(404).json({ message: 'Charity not found' });
//     }

//     // Update charity status
//     await charity.update({
//       isApproved: status === 'approved',
//       status: status,
//       comments: comments,
//       approvedAt: status === 'approved' ? new Date() : null,
//       approvedBy: req.user.id 
//     });

//     res.json({
//       message: `Charity ${status} successfully`,
//       charity: {
//         id: charity.id,
//         name: charity.name,
//         status: charity.status,
//         isApproved: charity.isApproved,
//         comments: charity.comments,
//         approvedAt: charity.approvedAt
//       }
//     });

//   } catch (err) {
//     console.error('Error approving charity:', err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.approveCharity = async (req, res) => {
  try {
    console.log("in aprove function");
    const { id } = req.params;
    const { isApproved } = req.body; // Destructure isApproved from request body

    // Check if isApproved is provided and is a boolean
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'isApproved must be a boolean value' });
    }

    const charity = await Charity.findByPk(id);

    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    // Update charity approval status
    await charity.update({ isApproved });

    res.json({
      message: `Charity ${isApproved ? 'approved' : 'rejected'} successfully`,
      charity
    });
  } catch (err) {
    console.error('Error approving charity:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.getDonationStats = async (req, res) => {
  try {
    const { charityId } = req.query; 

    //the where clause based on charityId
    const whereClause = charityId ? { charityId } : {}; 

    const totalDonations = await Donation.sum('amount', { where: whereClause }) || 0;
    const donationCount = await Donation.count({ where: whereClause });

    const monthlyStats = await Donation.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('YEAR', Sequelize.col('createdAt')), 'year'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: whereClause, //filter for charityId
      group: ['month', 'year'],
      order: [['year', 'DESC'], ['month', 'DESC']]
    });

    res.json({
      totalDonations,
      donationCount,
      monthlyStats
    });
  } catch (err) {
    console.error('Error getting donation stats:', err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: "Status must be either 'active' or 'inactive'" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ status });
    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
