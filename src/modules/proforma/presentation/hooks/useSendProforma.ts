import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendProforma } from '../../infrastructure/proformaApi';

export const useSendProforma = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, channel }: { id: string; channel: 'email' | 'whatsapp' }) => 
      sendProforma(id, channel),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proformas'] });
      toast.success('Operación exitosa', {
        description: data.message || `Proforma enviada exitosamente por ${variables.channel === 'email' ? 'Email' : 'WhatsApp'}`
      });
    },
    onError: (error: any, variables) => {
      const channelName = variables.channel === 'email' ? 'Email' : 'WhatsApp';
      toast.error('Ocurrió un error', {
        description: error.response?.data?.message || `Error al enviar la proforma por ${channelName}`
      });
    },
  });
};
