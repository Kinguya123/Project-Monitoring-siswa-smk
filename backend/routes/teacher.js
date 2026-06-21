const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../Middleware/auth');
const { Student, User, Class, Attendance, Journal, InternshipApplication, Company, Teacher } = require('../models');
// Ensure only teacher/school monitor accesses
router.use(protect);
router.use(authorize('guru', 'admin'));
// @desc    Get Teacher Dashboard Stats
// @route   GET /api/teacher/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const pendingApps = await InternshipApplication.count({ where: { status: 'pending' } });
    const verifiedJournals = await Journal.count({ where: { status: 'verified' } });
    const pendingJournals = await Journal.count({ where: { status: 'pending' } });
    res.json({
      stats: {
        totalStudents,
        pendingApps,
        verifiedJournals,
        pendingJournals
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving teacher stats', error: error.message });
  }
});
// @desc    Get All Internship Applications
// @route   GET /api/teacher/applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await InternshipApplication.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          include: [
            { model: User, as: 'user', attributes: ['name', 'email'] },
            { model: Class, as: 'class' }
          ]
        },
        { model: Company, as: 'company' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});
// @desc    Approve or Reject Application
// @route   PUT /api/teacher/applications/:id
router.put('/applications/:id', async (req, res) => {
  const { status, reviewNotes } = req.body; // 'approved' or 'rejected'
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }
  try {
    const application = await InternshipApplication.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.status = status;
    application.reviewNotes = reviewNotes || '';
    await application.save();
    // If approved, assign student's companyId
    if (status === 'approved') {
      const student = await Student.findByPk(application.studentId);
      if (student) {
        student.companyId = application.companyId;
        await student.save();
      }
    }
    res.json({ message: `Application status updated to ${status}`, application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update application', error: error.message });
  }
});
// @desc    Get list of all students
// @route   GET /api/teacher/students
router.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'profilePicture'] },
        { model: Class, as: 'class' },
        { model: Company, as: 'company' }
      ]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving students list', error: error.message });
  }
});
// @desc    Get specific student details (attendances, journals, grades)
// @route   GET /api/teacher/students/:id
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'profilePicture'] },
        { model: Class, as: 'class' },
        { model: Company, as: 'company' }
      ]
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const attendances = await Attendance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });
    const journals = await Journal.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });
    res.json({ student, attendances, journals });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving student details', error: error.message });
  }
});
module.exports = router;
