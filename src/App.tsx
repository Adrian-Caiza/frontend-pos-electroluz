import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from './shared/components/ui/sonner';
import { useAuthStore } from './shared/stores/useAuthStore';
import { AuthLayout } from './shared/components/layout/AuthLayout';
import { MainLayout } from './shared/components/layout/MainLayout';
import { AuthGuard } from './shared/components/layout/AuthGuard';
import { GuestGuard } from './shared/components/layout/GuestGuard';
import { RoleGuard } from './shared/components/layout/RoleGuard';
import LoginPage from './app/auth/login/page';
import DashboardPage from './app/dashboard/page';
import ProductosPage from './app/productos/page';
import SucursalesPage from './app/sucursales/page';
import CajaPage from './app/caja/page';
import UsuariosPage from './app/usuarios/page';
import { ClientesPage } from './app/clientes/page';
import { StockPage } from './app/stock/page';
import MetodosPagoPage from './app/metodos-pago/page';
import ProformasPage from './app/proformas/page';
import MarcasPage from './app/marcas/page';
import MedidasPage from './app/medidas/page';
import TerminalPage from './app/terminal/page';
import UnauthorizedPage from './app/unauthorized/page';
import CategoriasPage from './app/categorias/page';
import { AlertsPage } from './modules/alert/presentation/pages/AlertsPage';
import { ThemeProvider } from './shared/components/theme-provider';

const HomeRedirect = () => {
  const { user } = useAuthStore();
  if (user?.usrol === 'jefe') return <Navigate to="/dashboard" replace />;
  if (user?.usrol === 'cajero') return <Navigate to="/caja" replace />;
  if (user?.usrol === 'empleado') return <Navigate to="/terminal" replace />;
  return <Navigate to="/unauthorized" replace />;
};

function App() {
  const { company } = useAuthStore();

  useEffect(() => {
    if (company?.emlogo) {
      // Remove all existing favicons
      const links = document.querySelectorAll("link[rel~='icon']");
      links.forEach(l => l.remove());

      // Create a fresh one by fetching it as a Blob to bypass CORP same-origin policy
      fetch(`${company.emlogo}?v=${new Date().getTime()}`)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('link');
          link.type = blob.type || 'image/png';
          link.rel = 'icon';
          link.href = url;
          document.head.appendChild(link);
        })
        .catch(err => console.error('Error loading favicon:', err));
    } else {
      // Revert to POS SVG if logged out
      const links = document.querySelectorAll("link[rel~='icon']");
      links.forEach(l => l.remove());
      const link = document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = '/favicon.svg';
      document.head.appendChild(link);
    }
  }, [company?.emlogo]);

  useEffect(() => {
    if (company?.emrznsocial) {
      document.title = company.emrznsocial;
    } else {
      document.title = 'Electroluz';
    }
  }, [company]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
            <Route path="/auth/login" element={<LoginPage />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
            <Route path="/" element={<HomeRedirect />} />

            {/* Dashboard for 'jefe' */}
            <Route
              path="dashboard"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <DashboardPage />
                </RoleGuard>
              }
            />

            {/* Sucursales for 'jefe' */}
            <Route
              path="sucursales"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <SucursalesPage />
                </RoleGuard>
              }
            />

            {/* Caja for 'jefe' and 'cajero' */}
            <Route
              path="caja"
              element={
                <RoleGuard allowedRoles={['jefe', 'cajero']}>
                  <CajaPage />
                </RoleGuard>
              }
            />

            {/* Productos for 'jefe' */}
            <Route
              path="productos"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <ProductosPage />
                </RoleGuard>
              }
            />

            {/* Categorías for 'jefe' */}
            <Route
              path="/categorias"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <CategoriasPage />
                </RoleGuard>
              }
            />

            {/* Marcas for 'jefe' */}
            <Route
              path="/marcas"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <MarcasPage />
                </RoleGuard>
              }
            />

            {/* Medidas for 'jefe' and 'empleado' */}
            <Route
              path="/medidas"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado']}>
                  <MedidasPage />
                </RoleGuard>
              }
            />

            {/* Usuarios for 'jefe' */}
            <Route
              path="/usuarios"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <UsuariosPage />
                </RoleGuard>
              }
            />
            <Route
              path="/clientes"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado']}>
                  <ClientesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/stock"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado']}>
                  <StockPage />
                </RoleGuard>
              }
            />
            <Route
              path="/metodos-pago"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado']}>
                  <MetodosPagoPage />
                </RoleGuard>
              }
            />
            <Route
              path="/proformas"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado']}>
                  <ProformasPage />
                </RoleGuard>
              }
            />
            <Route
              path="/terminal"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado']}>
                  <TerminalPage />
                </RoleGuard>
              }
            />
            <Route
              path="/alertas"
              element={
                <RoleGuard allowedRoles={['jefe', 'empleado', 'administrador']}>
                  <AlertsPage />
                </RoleGuard>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

export default App;
