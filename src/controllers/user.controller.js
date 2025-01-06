const { User } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { name, phone, address } = req.body;
    const updateData = {};
    
    // Only include fields that are provided in the request
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    await user.update(updateData);
    
    // Get updated user without password
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: err.message });
  }
};
