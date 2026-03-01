import type { Client, CreateClientDto, UpdateClientDto } from '@/types/client.types';
import api from './axios-config';

// Récupérer tous les clients
export const getAllClients = async (): Promise<Client[]> => {
  const response = await api.get('/client');
  return response.data;
};

// Récupérer un client par ID
export const getClientById = async (id: number): Promise<Client> => {
  const response = await api.get(`/client/${id}`);
  return response.data;
};

// Créer un nouveau client
export const createClient = async (
  clientData: CreateClientDto,
): Promise<Client> => {
  const response = await api.post('/client', clientData);
  return response.data;
};

// Mettre à jour un client
export const updateClient = async (
  id: number,
  clientData: UpdateClientDto,
): Promise<Client> => {
  const response = await api.patch(`/client/${id}`, clientData);
  return response.data;
};

// Supprimer un client
export const deleteClient = async (id: number): Promise<void> => {
  await api.delete(`/client/${id}`);
};
