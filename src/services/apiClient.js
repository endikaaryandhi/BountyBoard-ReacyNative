import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config/api';

// Buat instance axios tunggal
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout 10 detik. Jika backend mati, request akan batal otomatis.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menangani error secara global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      Alert.alert('Connection Error', 'Backend PWA tidak merespon (Timeout). Pastikan server berjalan.');
    } else if (!error.response) {
      Alert.alert('Network Error', 'Tidak dapat terhubung ke Backend PWA. Cek koneksi internet atau status server.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;