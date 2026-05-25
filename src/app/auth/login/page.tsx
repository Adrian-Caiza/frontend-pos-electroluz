import { AuthLayout } from '../../../shared/components/layout/AuthLayout';
import { LoginForm } from '../../../modules/auth/presentation/components/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
