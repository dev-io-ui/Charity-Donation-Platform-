const { Charity } = require('../models');
const { Op } = require('sequelize');

exports.getAllCharities = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    
    let whereClause = { isApproved: true };
    
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (location) {
      whereClause.location = location;
    }

    const charities = await Charity.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCharities = async (req, res) => {
  try {
   

    const charities = await Charity.findByPk( req.params.id);
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCharity = async (req, res) => {
  try {
    const charity = await Charity.create({
      ...req.body,
      isApproved: false
    });
    res.status(201).json({
      message: "Charity created successfully, pending approval",
      charity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }
    await charity.update(req.body);
    res.json({
      message: "Charity updated successfully",
      charity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveCharity = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }
    await charity.update({ isApproved: req.body.isApproved });
    res.json({
      message: `Charity ${req.body.isApproved ? 'approved' : 'rejected'} successfully`,
      charity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
