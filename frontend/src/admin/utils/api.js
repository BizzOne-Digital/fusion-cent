import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('fsAdmin');
  const admin = saved ? JSON.parse(saved) : null;
  if (admin?.token) config.headers.Authorization = `Bearer ${admin.token}`;
  return config;
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Orders
export const getOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const getOrderStats = () => api.get('/orders/stats');

// Reviews
export const getReviews = () => api.get('/reviews');
export const approveReview = (id) => api.put(`/reviews/${id}/approve`);

// Settings
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

// Upload
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const uploadImages = (files) => {
  const fd = new FormData();
  files.forEach(f => fd.append('images', f));
  return api.post('/upload/images', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const deleteImage = (public_id) => api.delete('/upload/image', { data: { public_id } });

// Users
export const getUsers = () => api.get('/users');

export default api;
