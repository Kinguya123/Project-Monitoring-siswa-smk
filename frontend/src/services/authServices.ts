import api from './api';

// Helper function untuk menyimpan data sesi
const setAuthSession = (data: { token: string; role: string; name: string }) => {
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userName', data.name);
  }
};

export const login = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  setAuthSession(response.data);
  return response.data;
};

export const registerSiswa = async (formData: any) => {
  const response = await api.post('/auth/register/siswa', formData);
  setAuthSession(response.data);
  return response.data;
};

export const loginGoogle = async (googleData: any) => {
  const response = await api.post('/auth/google', googleData);
  setAuthSession(response.data);
  return response.data;
};

export const getClassesList = async () => {
  const response = await api.get('/admin/classes');
  return response.data;
};