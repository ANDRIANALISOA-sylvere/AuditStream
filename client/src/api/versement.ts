import type {
  Versement,
  CreateVersementDto,
  UpdateVersementDto,
} from '@/types/versement.types';
import api from './axios-config';

export const getAllVersements = async (): Promise<Versement[]> => {
  const response = await api.get('/versement');
  return response.data;
};

export const createVersement = async (
  data: CreateVersementDto,
): Promise<Versement> => {
  const response = await api.post('/versement', data);
  return response.data;
};

export const updateVersement = async (
  numero_versement: string,
  data: UpdateVersementDto,
): Promise<Versement> => {
  const response = await api.patch(`/versement/${numero_versement}`, data);
  return response.data;
};

export const deleteVersement = async (
  numero_versement: string,
): Promise<void> => {
  await api.delete(`/versement/${numero_versement}`);
};