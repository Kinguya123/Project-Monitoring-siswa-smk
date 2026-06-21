const express = require('express');
const router = express.Router();
const { Class, Student, Teacher, Supervisor, User } = require('../models');
// @desc    Get List of Classes (Public, needed for Registration Dropdown)
// @route   GET /api/admin/classes
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.findAll({
      order: [['name', 'ASC']]
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving classes', error: error.message });
  }
});
module.exports = router;
