const { User, Charity, Donation } = require('../models');
const { Op } = require('sequelize');

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

exports.getDonationStats = async (req, res) => {
  try {
    // Overall statistics
    const totalDonations = await Donation.sum('amount');
    const donationCount = await Donation.count();
    
    // Monthly statistics
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyStats = await Donation.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo }
      },
      group: [
        sequelize.fn('MONTH', sequelize.col('createdAt')),
        sequelize.fn('YEAR', sequelize.col('createdAt'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'DESC'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'DESC']
      ]
    });

    // Charity-wise statistics
    const charityStats = await Donation.findAll({
      attributes: [
        'CharityId',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [{
        model: Charity,
        attributes: ['name']
      }],
      group: ['CharityId', 'Charity.name'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });
    
    res.json({
      overall: {
        totalAmount: totalDonations,
        totalCount: donationCount
      },
      monthly: monthlyStats,
      byCharity: charityStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user status (active/inactive)
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ isActive });
    res.json({ message: "User status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
