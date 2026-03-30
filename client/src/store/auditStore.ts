import { create } from 'zustand';
import * as auditApi from '@/api/audit-versement';
import type { AuditVersement } from '@/types/audit.types';

interface AuditState {
  audits: AuditVersement[];
  isLoading: boolean;
  error: string | null;

  fetchAudits: () => Promise<void>;
  clearError: () => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  audits: [],
  isLoading: false,
  error: null,

  fetchAudits: async () => {
    set({ isLoading: true, error: null });
    try {
      const audits = await auditApi.getAllAudits();
      set({ audits, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Erreur lors du chargement de l'audit",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Sélecteurs
export const useAudits = () => useAuditStore((state) => state.audits);
export const useAuditsLoading = () => useAuditStore((state) => state.isLoading);
export const useAuditsError = () => useAuditStore((state) => state.error);

// Sélecteurs calculés
export const useAuditStats = () => {
  const audits = useAudits();
  return {
    insertions: audits.filter((a) => a.type_action === 'INSERT').length,
    modifications: audits.filter((a) => a.type_action === 'UPDATE').length,
    suppressions: audits.filter((a) => a.type_action === 'DELETE').length,
  };
};
