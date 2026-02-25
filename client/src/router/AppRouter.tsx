import LoginForm from '@/components/common/login-form';
import AdminSpace from '@/pages/Admin/AdminSpace';
import ClientSpace from '@/pages/clients/ClientSpace';
import { Route, Routes } from 'react-router';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/client" element={<ClientSpace />} />
      <Route path="/" element={<AdminSpace />} />
    </Routes>
  );
};
