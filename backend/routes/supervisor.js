const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../Middleware/auth');
const { Student, User, Class, Attendance, Journal, Grade, Supervisor, Company } = require('../models');
// Ensure only industrial supervisor accesses
router.use(protect);
router.use(authorize('pembimbing', 'admin'));
// Helper to get supervisor companyId
const getSupervisorCompanyId = async (userId) => {
  const supervisor = await Supervisor.findOne({ where: { userId } });
  return supervisor ? supervisor.companyId : null;
};
const getSupervisorRecord = async (userId) => {
  return await Supervisor.findOne({ where: { userId } });
};
// @desc    Get Supervisor Dashboard stats
// @route   GET /api/supervisor/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const companyId = await getSupervisorCompanyId(req.user.id);
    if (!companyId) return res.status(404).json({ message: 'Supervisor not associated with any company' });
    // Students at this company
    const students = await Student.findAll({
      where: { companyId },
      attributes: ['id']
    });
    const studentIds = students.map(s => s.id);
    const studentCount = studentIds.length;
    const pendingJournals = studentCount > 0 ? await Journal.count({
      where: { studentId: studentIds, status: 'pending' }
    }) : 0;
    const gradedCount = studentCount > 0 ? await Grade.count({
      where: { studentId: studentIds }
    }) : 0;
    res.json({
      stats: {
        studentCount,
        pendingJournals,
        gradedCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving stats', error: error.message });
  }
});
// @desc    Get assigned students list
// @route   GET /api/supervisor/students
router.get('/students', async (req, res) => {
  try {
    const companyId = await getSupervisorCompanyId(req.user.id);
    if (!companyId) return res.json([]);
    const students = await Student.findAll({
      where: { companyId },
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'profilePicture'] },
        { model: Class, as: 'class' },
        { model: Grade, as: 'grades', limit: 1 }
      ]
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});
// @desc    Verify/Approve Student Journal
// @route   PUT /api/supervisor/journals/:id
router.put('/journals/:id', async (req, res) => {
  const { status, notes } = req.body; // status: 'verified'
  if (status !== 'verified') {
    return res.status(400).json({ message: 'Invalid status update. Only "verified" is supported.' });
  }
  try {
    const journal = await Journal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    journal.status = status;
    journal.notes = notes || '';
    await journal.save();
    res.json({ message: 'Journal verified successfully', journal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify journal', error: error.message });
  }
});
// @desc    Get Student Details (Attendances & Journals)
// @route   GET /api/supervisor/students/:id
router.get('/students/:id', async (req, res) => {
  try {
    const companyId = await getSupervisorCompanyId(req.user.id);
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'profilePicture'] },
        { model: Class, as: 'class' }
      ]
    });
    if (!student || student.companyId !== companyId) {
      return res.status(404).json({ message: 'Student not found or access denied' });
    }
    const attendances = await Attendance.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });
    const journals = await Journal.findAll({
      where: { studentId: student.id },
      order: [['date', 'DESC']]
    });
    const grades = await Grade.findOne({
      where: { studentId: student.id }
    });
    res.json({ student, attendances, journals, grades });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving details', error: error.message });
  }
});
// @desc    Input or update grades for student
// @route   POST /api/supervisor/grades
router.post('/grades', async (req, res) => {
  const { studentId, scoreWorkAspect, scoreBehaviorAspect, scoreTechnicalAspect, notes } = req.body;
  try {
    const supervisor = await getSupervisorRecord(req.user.id);
    const student = await Student.findByPk(studentId);
    if (!student || student.companyId !== supervisor.companyId) {
      return res.status(400).json({ message: 'Access denied: student not at your company' });
    }
    const workScore = parseInt(scoreWorkAspect) || 0;
    const behaviorScore = parseInt(scoreBehaviorAspect) || 0;
    const techScore = parseInt(scoreTechnicalAspect) || 0;
    const avg = parseFloat(((workScore + behaviorScore + techScore) / 3).toFixed(2));
    let grade = await Grade.findOne({
      where: { studentId, supervisorId: supervisor.id }
    });
    if (grade) {
      grade.scoreWorkAspect = workScore;
      grade.scoreBehaviorAspect = behaviorScore;
      grade.scoreTechnicalAspect = techScore;
      grade.averageScore = avg;
      grade.notes = notes || '';
      await grade.save();
    } else {
      grade = await Grade.create({
        studentId,
        supervisorId: supervisor.id,
        scoreWorkAspect: workScore,
        scoreBehaviorAspect: behaviorScore,
        scoreTechnicalAspect: techScore,
        averageScore: avg,
        notes: notes || ''
      });
    }
    res.json({ message: 'Grade saved successfully', grade });
  } catch (error) {
    res.status(500).json({ message: 'Error saving grades', error: error.message });
  }
});
module.exports = router;
