import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ProformaRepository } from '../../infrastructure/ProformaRepository';
import { GetProformaPdfUseCase } from '../../application/use-cases/GetProformaPdfUseCase';
import type { ProformaPdfResponse } from '../../domain/Proforma';

const repository = new ProformaRepository();
const getPdfUseCase = new GetProformaPdfUseCase(repository);

export const useProformaPdf = () => {
  return useMutation<ProformaPdfResponse, Error, string>({
    mutationFn: (id: string) => getPdfUseCase.execute(id),
    onSuccess: (data) => {
      if (data.documento && data.documento.docurl) {
        window.open(data.documento.docurl, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Ocurrió un error', {
        description: 'La proforma no tiene un documento PDF disponible'
      });
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al obtener el PDF de la proforma';
      toast.error('Ocurrió un error', {
        description: message
      });
    },
  });
};
