const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Require Admin Role!" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
