import { create } from 'zustand';
import * as versementApi from '@/api/versement';
import type {
  Versement,
  CreateVersementDto,
  UpdateVersementDto,
} from '@/types/versement.types';

interface VersementState {
  versements: Versement[];
  isLoading: boolean;
  error: string | null;
  totalVersements: number;

  fetchVersements: () => Promise<void>;
  addVersement: (data: CreateVersementDto) => Promise<Versement>;
  editVersement: (
    numero_versement: string,
    data: UpdateVersementDto,
  ) => Promise<void>;
  removeVersement: (numero_versement: string) => Promise<void>;
  clearError: () => void;
}

export const useVersementStore = create<VersementState>((set) => ({
  versements: [],
  isLoading: false,
  error: null,
  totalVersements: 0,

  fetchVersements: async () => {
    set({ isLoading: true, error: null });
    try {
      const versements = await versementApi.getAllVersements();
      set({
        versements,
        totalVersements: versements.length,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Erreur lors du chargement des versements',
        isLoading: false,
      });
    }
  },

  addVersement: async (data: CreateVersementDto) => {
    set({ isLoading: true, error: null });
    try {
      const newVersement = await versementApi.createVersement(data);
      set((state) => ({
        versements: [newVersement, ...state.versements],
        totalVersements: state.totalVersements + 1,
        isLoading: false,
      }));
      return newVersement;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Erreur lors de la création du versement',
        isLoading: false,
      });
      throw error;
    }
  },

  editVersement: async (numero_versement: string, data: UpdateVersementDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await versementApi.updateVersement(
        numero_versement,
        data,
      );
      set((state) => ({
        versements: state.versements.map((v) =>
          v.numero_versement === numero_versement ? updated : v,
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Erreur lors de la mise à jour du versement',
        isLoading: false,
      });
      throw error;
    }
  },

  removeVersement: async (numero_versement: string) => {
    set({ isLoading: true, error: null });
    try {
      await versementApi.deleteVersement(numero_versement);
      set((state) => ({
        versements: state.versements.filter(
          (v) => v.numero_versement !== numero_versement,
        ),
        totalVersements: state.totalVersements - 1,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Erreur lors de la suppression du versement',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

// Sélecteurs
export const useVersements = () =>
  useVersementStore((state) => state.versements);
export const useVersementsLoading = () =>
  useVersementStore((state) => state.isLoading);
export const useVersementsError = () =>
  useVersementStore((state) => state.error);
export const useTotalVersements = () =>
  useVersementStore((state) => state.totalVersements);

// Sélecteurs calculés
export const useTotalMontant = () => {
  const versements = useVersements();
  return versements.reduce((sum, v) => sum + v.montant, 0);
};
