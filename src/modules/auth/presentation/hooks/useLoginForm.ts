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

// In a real app with DI container, we'd inject this. For now we instantiate.
const authRepository = new AuthRepository();
const loginUseCase = new LoginUseCase(authRepository);

export const useLoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
      toast.success('Inicio de sesión exitoso');
      
      // Role-based redirection
      if (data.user.usrol === 'cajero') {
        navigate('/caja');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      // Manejar error 401, 422, 500, etc.
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
  };
};
