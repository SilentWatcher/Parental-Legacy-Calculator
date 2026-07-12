import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const calculationAPI = {
  save: (data) => API.post('/calculations', data),
  getAll: () => API.get('/calculations'),
  getOne: (id) => API.get(`/calculations/${id}`),
  delete: (id) => API.delete(`/calculations/${id}`),
};

export default API;
