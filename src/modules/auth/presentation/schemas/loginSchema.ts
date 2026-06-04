import { z } from 'zod';

export const loginSchema = z.object({
  emruc: z.string()
    .min(10, 'El RUC debe tener al menos 10 dígitos')
    .max(13, 'El RUC debe tener máximo 13 dígitos')
    .regex(/^[0-9]+$/, 'El RUC solo puede contener números'),
  usapodo: z.string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El usuario no puede contener espacios ni caracteres especiales'),
  uspassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
