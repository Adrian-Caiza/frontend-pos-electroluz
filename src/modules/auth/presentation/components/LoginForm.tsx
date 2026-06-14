import { Building2, User, Lock, AlertCircle } from 'lucide-react';
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
  const { form, onSubmit, isPending, errorMessage } = useLoginForm();

  return (
    <div className="w-full space-y-6">
      {/* Heading */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          ¡Bienvenido!
        </h2>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder al sistema.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-red-500/50 bg-red-500/10 text-red-500 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emruc"
            render={({ field, fieldState }: { field: any, fieldState: any }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input 
                      placeholder="RUC Empresa" 
                      {...field} 
                      icon={Building2}
                      className="h-12 bg-white dark:bg-gray-950" 
                      disabled={isPending}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-red-500 animate-in fade-in zoom-in">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usapodo"
            render={({ field, fieldState }: { field: any, fieldState: any }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input 
                      placeholder="Usuario" 
                      {...field} 
                      icon={User}
                      className="h-12 bg-white dark:bg-gray-950"
                      disabled={isPending}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-red-500 animate-in fade-in zoom-in">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="uspassword"
            render={({ field, fieldState }: { field: any, fieldState: any }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <PasswordInput 
                      placeholder="Contraseña" 
                      {...field} 
                      icon={Lock}
                      className="h-12 bg-white dark:bg-gray-950"
                      disabled={isPending}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <div className="absolute inset-y-0 right-10 flex items-center pr-3 pointer-events-none text-red-500 animate-in fade-in zoom-in">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md transition-all"
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
