import { Route, Routes, Navigate } from 'react-router';
import LoginForm from '@/components/common/login-form';
import AdminSpace from '@/pages/Admin/AdminSpace';
import ClientSpace from '@/pages/clients/ClientSpace';
import { ProtectedRoute } from '@/components/common/protected-route';
import { Role } from '@/types/auth.types';
import AuthCallback from '@/pages/auth/google-callback';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminSpace />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/client" 
        element={
          <ProtectedRoute allowedRoles={[Role.USER]}>
            <ClientSpace />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};