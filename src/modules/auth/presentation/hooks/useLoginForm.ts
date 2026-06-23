import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { loginSchema } from '../schemas/loginSchema';
import type { LoginFormData } from '../schemas/loginSchema';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { useAuthStore } from '../../../../shared/stores/useAuthStore';

import { useState } from 'react';

// In a real app with DI container, we'd inject this. For now we instantiate.
const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

export const useLoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      emruc: '',
      usapodo: '',
      uspassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) => loginUseCase.execute(data),
    onSuccess: (data) => {
      setAuth(data.user, data.company, data.accessToken, data.refreshToken);
      toast.success('Operación exitosa', {
        description: 'Inicio de sesión exitoso'
      });
      
      // Role-based redirection
      if (data.user.usrol === 'cajero') {
        navigate('/caja');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      // Manejar error 401, 422, 500, etc.
      let message = error.response?.data?.message;
      if (message === 'Unauthorized' || error.response?.status === 401) {
        message = 'Credenciales incorrectas.';
      } else if (!message) {
        message = 'Error al iniciar sesión.';
      }
      setErrorMessage(message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    errorMessage,
  };
};
