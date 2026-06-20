import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Auth API
export const authAPI = {
  register: (username, email, password, confirmPassword) =>
    api.post('/auth/register', { username, email, password, confirmPassword }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  logout: () =>
    api.post('/auth/logout'),
  getMe: () =>
    api.get('/auth/me'),
};

// URL API
export const urlAPI = {
  shortenUrl: (originalUrl, customSlug, description, tags) =>
    api.post('/urls/shorten', { originalUrl, customSlug, description, tags }),
  getAllUrls: (page = 1, limit = 10) =>
    api.get('/urls', { params: { page, limit } }),
  getUrl: (id) =>
    api.get(`/urls/${id}`),
  updateUrl: (id, description, tags) =>
    api.put(`/urls/${id}`, { description, tags }),
  deleteUrl: (id) =>
    api.delete(`/urls/${id}`),
  getAnalytics: (id) =>
    api.get(`/urls/${id}/analytics`),
};

export default api;
