const jwt = require('jsonwebtoken');
const { User, Student, Teacher, Supervisor } = require('../models');
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyforpklmonitoring');
      // Get user with basic details
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
        include: [
          { model: Student, as: 'student' },
          { model: Teacher, as: 'teacher' },
          { model: Supervisor, as: 'supervisor' }
        ]
      });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};
module.exports = { protect, authorize };