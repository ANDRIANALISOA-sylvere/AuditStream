import type { AuditVersement } from '@/types/audit.types';
import api from './axios-config';

export const getAllAudits = async (): Promise<AuditVersement[]> => {
  const response = await api.get('/versement/audits');
  return response.data;
};
