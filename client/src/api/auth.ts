import type { GoogleLoginResponse, User } from '@/types/auth.types';
import api from './axios-config';

export const GOOGLE_AUTH_URL = `${api.defaults.baseURL}/auth/google`;

export const redirectToGoogle = () => {
  window.location.href = GOOGLE_AUTH_URL;
};

export const handleGoogleCallback = async (
  code: string,
): Promise<GoogleLoginResponse> => {
  try {
    const response = await api.get<GoogleLoginResponse>(
      `/auth/callback?code=${code}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('auth-storage');
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    await api.get('api/auth/verify');
    return true;
  } catch {
    return false;
  }
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('api/auth/profile');
  return response.data;
};
