import type { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import type {
  Usuario,
  PaginatedUsuarios,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioStatusDto,
} from '../../domain/entities/Usuario';
import { usuarioApi } from '../services/usuarioApi';

export class UsuarioRepository implements IUsuarioRepository {
  async getUsuarios(page: number, pageSize: number): Promise<PaginatedUsuarios> {
    return usuarioApi.getUsuarios(page, pageSize);
  }

  async createUsuario(data: CreateUsuarioDto): Promise<Usuario> {
    return usuarioApi.createUsuario(data);
  }

  async updateUsuario(id: string, data: UpdateUsuarioDto): Promise<Usuario> {
    return usuarioApi.updateUsuario(id, data);
  }

  async updateUsuarioStatus(id: string, data: UpdateUsuarioStatusDto): Promise<{ message: string }> {
    return usuarioApi.updateUsuarioStatus(id, data);
  }

  async updateUsuarioPassword(id: string, uspassword: string): Promise<{ message: string }> {
    return usuarioApi.updateUsuarioPassword(id, uspassword);
  }
}
