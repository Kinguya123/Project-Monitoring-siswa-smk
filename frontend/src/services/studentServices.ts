import api from './api';
export const getStudentDashboard = async () => {
  const response = await api.get('/student/dashboard');
  return response.data;
};
export const getStudentAttendance = async () => {
  const response = await api.get('/student/attendance');
  return response.data;
};
export const studentCheckIn = async (location: string) => {
  const response = await api.post('/student/attendance/checkin', { location });
  return response.data;
};
export const studentCheckOut = async (location: string) => {
  const response = await api.post('/student/attendance/checkout', { location });
  return response.data;
};
export const getStudentJournals = async () => {
  const response = await api.get('/student/journals');
  return response.data;
};
export const addStudentJournal = async (journalData: any) => {
  const response = await api.post('/student/journals', journalData);
  return response.data;
};
export const applyInternship = async (companyData: any) => {
  const response = await api.post('/student/apply', companyData);
  return response.data;
};
export const getStudentApplications = async () => {
  const response = await api.get('/student/applications');
  return response.data;
};
export const getStudentMentorInfo = async () => {
  const response = await api.get('/student/mentor');
  return response.data;
};
export const getStudentGrades = async () => {
  const response = await api.get('/student/grades');
  return response.data;
};
