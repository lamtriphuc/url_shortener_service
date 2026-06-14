import { create } from 'zustand';
import api from '../lib/axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.email));
      set({ user: data.email, token: data.token, loading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.email));
      set({ user: data.email, token: data.token, loading: false });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;