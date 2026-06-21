import api from './api';
export const getSupervisorDashboard = async () => {
  const response = await api.get('/supervisor/dashboard');
  return response.data;
};
export const getSupervisorStudents = async () => {
  const response = await api.get('/supervisor/students');
  return response.data;
};
export const getSupervisorStudentDetails = async (studentId: number) => {
  const response = await api.get(`/supervisor/students/${studentId}`);
  return response.data;
};
export const verifyStudentJournal = async (journalId: number, verificationData: { status: 'verified', notes?: string }) => {
  const response = await api.put(`/supervisor/journals/${journalId}`, verificationData);
  return response.data;
};
export const submitStudentGrades = async (gradeData: {
  studentId: number,
  scoreWorkAspect: number,
  scoreBehaviorAspect: number,
  scoreTechnicalAspect: number,
  notes?: string
}) => {
  const response = await api.post('/supervisor/grades', gradeData);
  return response.data;
};
