import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    toast.dismiss();

    if (error) {
      console.error('Auth error:', error);

      toast.error(
        message
          ? decodeURIComponent(message)
          : "Vous n'êtes pas autorisé à accéder à cette application",
        {
          id: 'auth-error',
          duration: 5000,
        },
      );

      setTimeout(() => {
        navigate('/login');
      }, 3000);

      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(token, user);

        toast.success(`Bienvenue ${user.username || user.email}`, {
          id: 'auth-success',
          duration: 3000,
        });

        if (user.role === 'ADMIN') {
          navigate('/');
        } else {
          navigate('/client');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Erreur lors de la connexion', { id: 'auth-parse-error' });
        navigate('/login');
      }
    } else {
      navigate('/login');
    }

    return () => {
      toast.dismiss();
    };
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {searchParams.get('error')
            ? 'Redirection...'
            : 'Authentification en cours...'}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
