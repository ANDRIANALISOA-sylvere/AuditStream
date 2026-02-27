import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { handleGoogleCallback } from '@/api/auth';

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_API_URL) return;

      const { code } = event.data;
      
      if (code) {
        try {
          const response = await handleGoogleCallback(code);
          
          login(response.accessToken, response.user);
          
          if (response.user.role === 'ADMIN') {
            navigate('/');
          } else {
            navigate('/client');
          }
        } catch (error) {
          console.error('Auth error:', error);
          navigate('/login');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [login, navigate]);
};