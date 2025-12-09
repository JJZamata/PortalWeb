import axios from 'axios';
import { SignupData, SignupResponse } from './types';

const API_URL = 'https://backfiscamotov2.onrender.com/api/auth';

const authService = {
  login: async (data: SignupData): Promise<SignupResponse> => {
    try {
      const response = await axios.post<SignupResponse>(`${API_URL}/signin`, data);
      
      // Guardamos el token en localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
      }
      throw error;
    }
  },

  // Función para obtener el token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Función para cerrar sesión
  logout: (): void => {
    localStorage.removeItem('token');
  }
};

export default authService; 