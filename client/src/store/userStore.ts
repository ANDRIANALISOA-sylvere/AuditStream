import { create } from 'zustand';
import * as userApi from '@/api/user';
import type { CreateUserDto, UpdateUserDto, User } from '@/types/auth.types';

interface UserState {
  // État
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  totalUsers: number;

  // Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  addUser: (userData: CreateUserDto) => Promise<void>;
  updateUser: (id: number, userData: UpdateUserDto) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
  updateUserRole: (id: number, role: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // État initial
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  totalUsers: 0,

  // Récupérer tous les utilisateurs
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userApi.getAllUsers();
      set({
        users,
        totalUsers: users.length,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Erreur lors du chargement des utilisateurs',
        isLoading: false,
      });
    }
  },

  // Récupérer un utilisateur par ID
  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userApi.getUserById(id);
      set({ selectedUser: user, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement de l'utilisateur",
        isLoading: false,
      });
    }
  },

  // Ajouter un utilisateur
  addUser: async (userData: CreateUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const newUser = await userApi.createUser(userData);
      set((state) => ({
        users: [newUser, ...state.users],
        totalUsers: state.totalUsers + 1,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la création de l'utilisateur",
        isLoading: false,
      });
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id: number, userData: UpdateUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userApi.updateUser(id, userData);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        selectedUser: updatedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la mise à jour de l'utilisateur",
        isLoading: false,
      });
      throw error;
    }
  },

  // Supprimer un utilisateur
  removeUser: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await userApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        totalUsers: state.totalUsers - 1,
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors de la suppression de l'utilisateur",
        isLoading: false,
      });
      throw error;
    }
  },

  // Changer le rôle d'un utilisateur
  updateUserRole: async (id: number, role: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await userApi.changeUserRole(id, role);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        selectedUser: updatedUser,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || 'Erreur lors du changement de rôle',
        isLoading: false,
      });
      throw error;
    }
  },

  // Sélectionner un utilisateur
  setSelectedUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  // Effacer l'erreur
  clearError: () => {
    set({ error: null });
  },
}));

// Sélecteurs pour faciliter l'accès
export const useUsers = () => useUserStore((state) => state.users);
export const useSelectedUser = () =>
  useUserStore((state) => state.selectedUser);
export const useUsersLoading = () => useUserStore((state) => state.isLoading);
export const useUsersError = () => useUserStore((state) => state.error);
export const useTotalUsers = () => useUserStore((state) => state.totalUsers);
