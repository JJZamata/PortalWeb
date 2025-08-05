import axiosInstance from '@/lib/axios';
import { Usuario, UsuarioDetallado, AddUserFormData } from '../types';

export const usuariosService = {
  getUsuarios: async (page: number = 1) => {
    try {
      const response = await axiosInstance.get(`/users/?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  getUsuarioDetail: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalle del usuario:', error);
      throw error;
    }
  },

  addUsuario: async (payload: { username: string; email: string; password: string; roles: string[] }) => {
    try {
      const response = await axiosInstance.post('/auth/signup', payload);
      return response.data;
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      throw error;
    }
  },

  updateUsuario: async (id: number, payload: Partial<{ username: string; email: string; isActive: boolean }>) => {
    try {
      if (payload.hasOwnProperty('isActive')) {
        const endpoint = payload.isActive ? 
          `/fisca/admin/users/${id}/activate` : 
          `/fisca/admin/users/${id}/deactivate`;
        const response = await axiosInstance.put(endpoint);
        return response.data;
      } else {
        const response = await axiosInstance.put(`/fisca/admin/users/${id}`, payload);
        return response.data;
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  deleteUsuario: async (id: number) => {
    try {
      const response = await axiosInstance.put(`/fisca/admin/users/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  searchUsuarios: async (searchTerm: string, page: number = 1) => {
    try {
      const response = await axiosInstance.get(`/users/search?search=${searchTerm}&page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  }
};
