import { z } from 'zod';

export const loginSchema = z.object({
  emruc: z.string().min(10, 'El RUC debe tener al menos 10 caracteres').max(13, 'El RUC debe tener máximo 13 caracteres'),
  usapodo: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  uspassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
