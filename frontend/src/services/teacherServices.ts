import api from './api';
export const getTeacherDashboard = async () => {
  const response = await api.get('/teacher/dashboard');
  return response.data;
};
export const getInternshipApplications = async () => {
  const response = await api.get('/teacher/applications');
  return response.data;
};
export const updateApplicationStatus = async (appId: number, statusData: { status: 'approved' | 'rejected', reviewNotes?: string }) => {
  const response = await api.put(`/teacher/applications/${appId}`, statusData);
  return response.data;
};
export const getMonitoredStudents = async () => {
  const response = await api.get('/teacher/students');
  return response.data;
};
export const getMonitoredStudentDetails = async (studentId: number) => {
  const response = await api.get(`/teacher/students/${studentId}`);
  return response.data;
};
