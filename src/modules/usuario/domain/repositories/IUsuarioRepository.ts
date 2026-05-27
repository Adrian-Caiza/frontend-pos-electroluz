import type {
  Usuario,
  PaginatedUsuarios,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UpdateUsuarioStatusDto,
} from '../entities/Usuario';

export interface IUsuarioRepository {
  getUsuarios(page: number, pageSize: number): Promise<PaginatedUsuarios>;
  createUsuario(data: CreateUsuarioDto): Promise<Usuario>;
  updateUsuario(id: string, data: UpdateUsuarioDto): Promise<Usuario>;
  updateUsuarioStatus(id: string, data: UpdateUsuarioStatusDto): Promise<{ message: string }>;
}
