import { medidaApi } from '../services/medidaApi';
import type { CreateMedidaDto, UpdateMedidaDto, Medida } from '../../domain/entities/Medida';
import type { PaginatedResponse } from '../../../categoria/infrastructure/services/categoriaApi';

export class MedidaRepository {
  async getMedidas(page: number, pageSize: number): Promise<PaginatedResponse<Medida>> {
    return medidaApi.getMedidas(page, pageSize);
  }

  async getMedidaById(id: string): Promise<Medida> {
    return medidaApi.getMedidaById(id);
  }

  async createMedida(data: CreateMedidaDto): Promise<Medida> {
    return medidaApi.createMedida(data);
  }

  async updateMedida(id: string, data: UpdateMedidaDto): Promise<Medida> {
    return medidaApi.updateMedida(id, data);
  }
}

export const medidaRepository = new MedidaRepository();
