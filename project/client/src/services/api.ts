import axios from 'axios';
import type { DashboardStats, DownloadResponse, LoginResponse, Template } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),
};

export const templateApi = {
  getAll: () => api.get<Template[]>('/templates').then((r) => r.data),
  getBySlug: (slug: string) => api.get<Template>(`/templates/${slug}`).then((r) => r.data),
  upload: (formData: FormData) =>
    api.post<Template>('/templates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  update: (id: string, data: Partial<Template>) =>
    api.patch<Template>(`/templates/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/templates/${id}`).then((r) => r.data),
  download: (id: string) =>
    api.get<DownloadResponse>(`/templates/download/${id}`).then((r) => r.data),
  getDashboardStats: () =>
    api.get<DashboardStats>('/templates/dashboard/stats').then((r) => r.data),
};

export default api;
