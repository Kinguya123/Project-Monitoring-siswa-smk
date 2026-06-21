const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../Middleware/auth');
const { Student, User, Class, Attendance, Journal, Grade, Company, InternshipApplication, Supervisor } = require('../models');
const { Op } = require('sequelize');
// Make sure only student accesses
router.use(protect);
router.use(authorize('siswa'));
// Helper to get current Student record
const getStudentProfile = async (userId) => {
  return await Student.findOne({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: ['name', 'email', 'profilePicture'] },
      { model: Class, as: 'class' },
      { model: Company, as: 'company' }
    ]
  });
};
// @desc    Get Student Dashboard Statistics
// @route   GET /api/student/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    // Attendances count
    const totalAttendances = await Attendance.count({ where: { studentId: student.id, status: 'hadir' } });
    const attendanceRate = totalAttendances > 0 ? Math.min(100, Math.round((totalAttendances / 30) * 100)) : 0; // assuming 30 days of PKL target
    // Activity progress
    const totalJournals = await Journal.count({ where: { studentId: student.id } });
    const verifiedJournals = await Journal.count({ where: { studentId: student.id, status: 'verified' } });
    const journalProgress = totalJournals > 0 ? Math.round((verifiedJournals / totalJournals) * 100) : 0;
    // Latest Activities
    const latestJournals = await Journal.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']],
      limit: 3
    });
    res.json({
      student,
      stats: {
        attendanceRate,
        journalProgress,
        totalJournals,
        verifiedJournals,
        pklDays: totalAttendances
      },
      latestJournals
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dashboard', error: error.message });
  }
});
// @desc    Get Attendance History & Today status
// @route   GET /api/student/attendance
router.get('/attendance', async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = await Attendance.findOne({
      where: { studentId: student.id, date: today }
    });
    const history = await Attendance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']],
      limit: 15
    });
    res.json({ todayAttendance, history });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
});
// @desc    Check In (Clock In)
// @route   POST /api/student/attendance/checkin
router.post('/attendance/checkin', async (req, res) => {
  const { location } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  try {
    const student = await getStudentProfile(req.user.id);
    
    let attendance = await Attendance.findOne({
      where: { studentId: student.id, date: today }
    });
    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    if (!attendance) {
      attendance = await Attendance.create({
        studentId: student.id,
        date: today,
        checkInTime: timeString,
        checkInLocation: location || 'Tasikmalaya',
        status: 'hadir'
      });
    } else {
      attendance.checkInTime = timeString;
      attendance.checkInLocation = location || 'Tasikmalaya';
      attendance.status = 'hadir';
      await attendance.save();
    }
    res.json({ message: 'Checked in successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Check in failed', error: error.message });
  }
});
// @desc    Check Out (Clock Out)
// @route   POST /api/student/attendance/checkout
router.post('/attendance/checkout', async (req, res) => {
  const { location } = req.body;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  try {
    const student = await getStudentProfile(req.user.id);
    
    const attendance = await Attendance.findOne({
      where: { studentId: student.id, date: today }
    });
    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'Must check in before checking out' });
    }
    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today' });
    }
    attendance.checkOutTime = timeString;
    attendance.checkOutLocation = location || 'Tasikmalaya';
    await attendance.save();
    res.json({ message: 'Checked out successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Check out failed', error: error.message });
  }
});
// @desc    Get Journals (Aktivitas)
// @route   GET /api/student/journals
router.get('/journals', async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);
    const journals = await Journal.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journals', error: error.message });
  }
});
// @desc    Add Daily Journal (Aktivitas)
// @route   POST /api/student/journals
router.post('/journals', async (req, res) => {
  const { activityDetails, progressPercentage, imageUrl } = req.body;
  const today = new Date().toISOString().split('T')[0];
  try {
    const student = await getStudentProfile(req.user.id);
    // check if journal already exists for today
    const journalExists = await Journal.findOne({
      where: { studentId: student.id, date: today }
    });
    if (journalExists) {
      return res.status(400).json({ message: 'Journal already submitted for today' });
    }
    const journal = await Journal.create({
      studentId: student.id,
      date: today,
      activityDetails,
      progressPercentage: parseInt(progressPercentage) || 0,
      imageUrl,
      status: 'pending'
    });
    res.status(201).json({ message: 'Journal submitted successfully', journal });
  } catch (error) {
    res.status(500).json({ message: 'Journal submission failed', error: error.message });
  }
});
// @desc    Apply for Internship Placement
// @route   POST /api/student/apply
router.post('/apply', async (req, res) => {
  const { companyName, address, sector, phone, mentorName } = req.body;
  try {
    const student = await getStudentProfile(req.user.id);
    if (student.companyId) {
      return res.status(400).json({ message: 'You already have an active PKL placement' });
    }
    // Check if there is already a pending application
    const pendingApp = await InternshipApplication.findOne({
      where: { studentId: student.id, status: 'pending' }
    });
    if (pendingApp) {
      return res.status(400).json({ message: 'You have a pending application. Please wait for review.' });
    }
    // Create Company record
    const company = await Company.create({
      name: companyName,
      address,
      sector,
      phone,
      mentorName
    });
    // Create Application record
    const application = await InternshipApplication.create({
      studentId: student.id,
      companyId: company.id,
      status: 'pending'
    });
    res.status(201).json({ message: 'Application submitted successfully', application, company });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
});
// @desc    Get Current Applications
// @route   GET /api/student/applications
router.get('/applications', async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);
    const applications = await InternshipApplication.findAll({
      where: { studentId: student.id },
      include: [{ model: Company, as: 'company' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});
// @desc    Get Assigned Mentor/Supervisor Info
// @route   GET /api/student/mentor
router.get('/mentor', async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);
    if (!student.companyId) {
      return res.json({ message: 'No active internship placement yet.' });
    }
    const supervisors = await Supervisor.findAll({
      where: { companyId: student.companyId },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'profilePicture'] }]
    });
    // Also find any standard school teachers assigned as monitors. We can retrieve a random teacher as sample
    const teacher = await Teacher.findOne({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });
    res.json({
      company: student.company,
      supervisors,
      schoolTeacher: teacher
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor info', error: error.message });
  }
});
// @desc    Get Grades Report Card (Laporan Nilai)
// @route   GET /api/student/grades
router.get('/grades', async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);
    const grades = await Grade.findAll({
      where: { studentId: student.id },
      include: [{ model: Supervisor, as: 'supervisor', include: [{ model: User, as: 'user', attributes: ['name'] }] }]
    });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
});
module.exports = router;