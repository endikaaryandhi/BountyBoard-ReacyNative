import apiClient from './apiClient';

export const BountyService = {
  // Ambil semua data
  getAll: async () => {
    try {
      const response = await apiClient.get('/api/bounties');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ambil satu data detail
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/bounties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buat bounty baru
  create: async (data) => {
    try {
      const response = await apiClient.post('/api/bounties', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update status (Approved/Captured/Rejected)
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/api/bounties/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update data lengkap
  updateDetails: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/bounties/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Hapus data
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/bounties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};