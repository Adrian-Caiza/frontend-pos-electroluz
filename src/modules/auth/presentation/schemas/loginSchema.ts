import { z } from 'zod';

export const loginSchema = z.object({
  emruc: z.string()
    .trim()
    .min(1, 'El RUC es requerido')
    .length(13, 'El RUC debe tener exactamente 13 dígitos')
    .regex(/^[0-9]+$/, 'El RUC solo puede contener números'),

  usapodo: z.string()
    .trim()
    .min(1, 'El usuario es requerido')
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(30, 'El usuario no puede exceder 30 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El usuario no puede contener espacios ni caracteres especiales'),

  uspassword: z.string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
