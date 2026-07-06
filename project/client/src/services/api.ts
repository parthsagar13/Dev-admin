import axios from 'axios';
import type {
  CommerceDashboardStats,
  DownloadItem,
  DownloadResponse,
  LoginResponse,
  OrderItem,
  RazorpayOrderResponse,
  Template,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

const ADMIN_PATHS = ['/templates/upload', '/templates/dashboard/stats', '/admin/'];

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isAdminRequest = ADMIN_PATHS.some((p) => url.includes(p));
  const token = isAdminRequest
    ? localStorage.getItem('token')
    : localStorage.getItem('userToken') || localStorage.getItem('token');

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
  register: (name: string, email: string, password: string) =>
    api.post<LoginResponse>('/auth/register', { name, email, password }).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
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
  getDashboardStats: () =>
    api.get('/templates/dashboard/stats').then((r) => r.data),
};

export const paymentApi = {
  createOrder: (templateId: string) =>
    api.post<RazorpayOrderResponse>('/payment/create-order', { templateId }).then((r) => r.data),
  verify: (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    dbOrderId: string;
  }) => api.post('/payment/verify', data).then((r) => r.data),
};

export const downloadApi = {
  getSignedUrl: (templateId: string) =>
    api.get<DownloadResponse>(`/download/${templateId}`).then((r) => r.data),
  getMyDownloads: () => api.get<DownloadItem[]>('/downloads').then((r) => r.data),
};

export const orderApi = {
  getMyOrders: () => api.get<OrderItem[]>('/orders/my-orders').then((r) => r.data),
};

export const adminApi = {
  getCommerceStats: () =>
    api.get<CommerceDashboardStats>('/admin/dashboard/stats').then((r) => r.data),
  getOrders: () => api.get('/admin/orders').then((r) => r.data),
  getPayments: () => api.get('/admin/payments').then((r) => r.data),
  getDownloads: () => api.get('/admin/downloads').then((r) => r.data),
  getCustomers: () => api.get('/admin/customers').then((r) => r.data),
};

export default api;
