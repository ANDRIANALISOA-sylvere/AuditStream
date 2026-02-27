import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { redirectToGoogle, logout as apiLogout } from '@/api/auth';
import { Role } from '@/types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    logout: storeLogout,
    setLoading,
  } = useAuthStore();

  const loginWithGoogle = useCallback(() => {
    redirectToGoogle();
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogout();
      storeLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [storeLogout, navigate, setLoading]);

  const hasRole = useCallback((requiredRole: Role | Role[]) => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role as Role);
    }
    return user.role === requiredRole;
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === Role.ADMIN;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    logout: handleLogout,
    hasRole,
    isAdmin,
  };
};