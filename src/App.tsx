import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginPage from './app/auth/login/page';
import DashboardPage from './app/dashboard/page';
import CajaPage from './app/caja/page';
import ProductosPage from './app/productos/page';
import InventarioPage from './app/inventario/page';
import UsuariosPage from './app/usuarios/page';
import UnauthorizedPage from './app/unauthorized/page';
import { AuthGuard } from './shared/components/layout/AuthGuard';
import { GuestGuard } from './shared/components/layout/GuestGuard';
import { RoleGuard } from './shared/components/layout/RoleGuard';
import { MainLayout } from './shared/components/layout/MainLayout';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/auth/login"
            element={
              <GuestGuard>
                <LoginPage />
              </GuestGuard>
            }
          />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard for 'jefe' */}
            <Route
              path="dashboard"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <DashboardPage />
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

            {/* Inventario for 'jefe' */}
            <Route
              path="inventario"
              element={
                <RoleGuard allowedRoles={['jefe']}>
                  <InventarioPage />
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
