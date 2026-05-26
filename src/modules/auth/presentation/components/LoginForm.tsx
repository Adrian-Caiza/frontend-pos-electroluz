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

export const LoginForm = () => {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <div className="w-full max-w-sm mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Login
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
                    placeholder="Contraseña" 
                    {...field} 
                    className="h-12 bg-white dark:bg-gray-950"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl shadow-md transition-all"
              disabled={isPending}
            >
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
