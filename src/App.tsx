import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthLayout } from './shared/components/layout/AuthLayout';
import { MainLayout } from './shared/components/layout/MainLayout';
import { AuthGuard } from './shared/components/layout/AuthGuard';
import { GuestGuard } from './shared/components/layout/GuestGuard';
import { RoleGuard } from './shared/components/layout/RoleGuard';
import LoginPage from './app/auth/login/page';
import DashboardPage from './app/dashboard/page';
import CajaPage from './app/caja/page';
import SucursalesPage from './app/sucursales/page';
import ProductosPage from './app/productos/page';
import UsuariosPage from './app/usuarios/page';
import UnauthorizedPage from './app/unauthorized/page';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
            <Route path="/auth/login" element={<LoginPage />} />
          </Route>
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
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



            {/* Usuarios for 'jefe' */}
            <Route
              path="usuarios"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <UsuariosPage />
                </RoleGuard>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
