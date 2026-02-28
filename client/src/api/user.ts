import type { CreateUserDto, UpdateUserDto, User } from '@/types/auth.types';
import api from './axios-config';

// Récupérer tous les utilisateurs
export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get('/user');
  return response.data;
};

// Récupérer un utilisateur par ID
export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

// Créer un nouvel utilisateur
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  const response = await api.post('/user', userData);
  return response.data;
};

// Mettre à jour un utilisateur
export const updateUser = async (
  id: number,
  userData: UpdateUserDto,
): Promise<User> => {
  const response = await api.patch(`/user/${id}`, userData);
  return response.data;
};

// Supprimer un utilisateur
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/user/${id}`);
};

// Changer le rôle d'un utilisateur
export const changeUserRole = async (
  id: number,
  role: string,
): Promise<User> => {
  const response = await api.patch(`/user/${id}/role`, { role });
  return response.data;
};
