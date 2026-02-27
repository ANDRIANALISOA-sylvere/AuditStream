import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    if (window.opener) {
      const data = window.opener?.authData;
      if (data) {
        login(data.accessToken, data.user);
        window.close();
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const userStr = params.get('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          login(token, user);

          if (user.role === 'ADMIN') {
            navigate('/');
          } else {
            navigate('/client');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Authentification réussie, redirection...
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;
