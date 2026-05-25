import { useLoginForm } from '../hooks/useLoginForm';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/form';

// Placeholder icons for social logins to match the design
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600" fill="currentColor">
    <path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02Z"/>
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-900 dark:text-white" fill="currentColor">
    <path d="M16.36 12.44c.02-2.35 1.92-3.46 2.01-3.52-1.09-1.61-2.79-1.83-3.4-1.87-1.45-.15-2.84.86-3.58.86-.75 0-1.89-.84-3.11-.82-1.58.02-3.05.92-3.87 2.35-1.65 2.87-.42 7.12 1.19 9.47.8 1.15 1.73 2.43 3.01 2.39 1.23-.05 1.7-.8 3.19-.8 1.49 0 1.98.8 3.23.78 1.28-.02 2.1-.17 2.88-1.32.91-1.33 1.28-2.62 1.3-2.69-.03-.01-2.52-.97-2.85-4.83ZM14.9 7.74c.67-.81 1.12-1.93.99-3.05-1 .04-2.18.67-2.86 1.48-.6.71-1.14 1.86-.99 2.95 1.11.09 2.18-.57 2.86-1.38Z"/>
  </svg>
);
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84A11.002 11.002 0 0 0 12 23Z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16A10.99 10.99 0 0 0 1 12c0 1.76.42 3.43 1.16 4.93l3.68-2.84Z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
  </svg>
);

export const LoginForm = () => {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <div className="w-full max-w-sm mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emruc"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="RUC Empresa" 
                    {...field} 
                    className="h-12 bg-white dark:bg-gray-950" 
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usapodo"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Usuario" 
                    {...field} 
                    className="h-12 bg-white dark:bg-gray-950"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uspassword"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput 
                    placeholder="Password" 
                    {...field} 
                    className="h-12 bg-white dark:bg-gray-950"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-1">
            <a href="#" className="text-sm font-medium text-[#4f46e5] hover:underline">
              Forgot your password?
            </a>
          </div>

          <div className="flex justify-center gap-4 pt-6 pb-2">
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <FacebookIcon />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <AppleIcon />
            </button>
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <GoogleIcon />
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow-md transition-all"
            disabled={isPending}
          >
            {isPending ? "Ingresando..." : "Login"}
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-12 text-base font-semibold rounded-xl text-[#4f46e5] border-[#4f46e5] hover:bg-[#4f46e5]/10"
          >
            Register here &rarr;
          </Button>
        </form>
      </Form>
    </div>
  );
};
