const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Class, Teacher, Supervisor, Company } = require('../models');
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkeyforpklmonitoring', {
    expiresIn: '30d'
  });
};
// @desc    Register Student
// @route   POST /api/auth/register/siswa
// @access  Public
router.post('/register/siswa', async (req, res) => {
  const { name, email, password, nis, className, phone, address } = req.body;
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const studentExists = await Student.findOne({ where: { nis } });
    if (studentExists) {
      return res.status(400).json({ message: 'NIS already exists' });
    }
    // Find class
    const selectedClass = await Class.findOne({ where: { name: className } });
    if (!selectedClass) {
      return res.status(400).json({ message: 'Invalid class selection' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'siswa'
    });
    const student = await Student.create({
      userId: user.id,
      classId: selectedClass.id,
      nis,
      phone,
      address
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});
// @desc    Register/Login via Google (Mock for Guru / Pembimbing)
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
  const { name, email, googleId, profilePicture, role, additionalInfo } = req.body;
  // additionalInfo could contain: nip (for Guru) or companyName (for Pembimbing)
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // Create user
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture,
        role // 'guru' or 'pembimbing'
      });
      if (role === 'guru') {
        const nip = additionalInfo?.nip || `G-${Date.now()}`;
        await Teacher.create({
          userId: user.id,
          nip,
          phone: additionalInfo?.phone || ''
        });
      } else if (role === 'pembimbing') {
        // Create company or find company
        const companyName = additionalInfo?.companyName || 'PT. Mitra PKL';
        let company = await Company.findOne({ where: { name: companyName } });
        if (!company) {
          company = await Company.create({
            name: companyName,
            address: additionalInfo?.companyAddress || 'Tasikmalaya',
            sector: 'Umum'
          });
        }
        await Supervisor.create({
          userId: user.id,
          companyId: company.id,
          phone: additionalInfo?.phone || ''
        });
      }
    } else {
      // If user exists, update google details
      user.googleId = googleId;
      if (profilePicture) user.profilePicture = profilePicture;
      await user.save();
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Google Auth failed', error: error.message });
  }
});
// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (user && user.password && bcrypt.compareSync(password, user.password)) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});
module.exports = router;