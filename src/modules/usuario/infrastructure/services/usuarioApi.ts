import { apiClient } from '../../../../shared/lib/apiClient';
import type {
  Usuario,
  PaginatedUsuarios,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioStatusDto,
} from '../../domain/entities/Usuario';

export const usuarioApi = {
  getUsuarios: async (page: number, pageSize: number, search?: string, status?: string): Promise<PaginatedUsuarios> => {
    const params: Record<string, any> = { page, pageSize };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await apiClient.get('/users', {
      params,
    });
    return response.data;
  },

  createUsuario: async (data: CreateUsuarioDto): Promise<Usuario> => {
    const formData = new FormData();
    formData.append('usemid', data.usemid);
    formData.append('usnombre', data.usnombre);
    formData.append('usapodo', data.usapodo);
    formData.append('uscorreo', data.uscorreo);
    if (data.uspassword) {
      formData.append('uspassword', data.uspassword);
    }
    formData.append('usrol', data.usrol);
    if (data.imagen) {
      formData.append('imagen', data.imagen);
    }

    const response = await apiClient.post('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateUsuario: async (id: string, data: UpdateUsuarioDto): Promise<Usuario> => {
    const formData = new FormData();
    if (data.usnombre) formData.append('usnombre', data.usnombre);
    if (data.uscorreo) formData.append('uscorreo', data.uscorreo);
    if (data.usrol) formData.append('usrol', data.usrol);
    if (data.usestado) formData.append('usestado', data.usestado);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await apiClient.patch(`/users/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateUsuarioStatus: async (id: string, data: UpdateUsuarioStatusDto): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/users/${id}/status`, data);
    return response.data;
  },

  updateUsuarioPassword: async (id: string, uspassword: string): Promise<{ message: string }> => {
    const response = await apiClient.patch(`/users/${id}/password`, { uspassword });
    return response.data;
  },
};
