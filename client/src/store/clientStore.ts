import { create } from 'zustand';
import * as clientApi from '@/api/client';
import type { Client, CreateClientDto, UpdateClientDto } from '@/types/client.types';

interface ClientState {
  // État
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;
  totalClients: number;

  // Actions
  fetchClients: () => Promise<void>;
  fetchClientById: (id: number) => Promise<void>;
  addClient: (clientData: CreateClientDto) => Promise<Client>;
  updateClient: (id: number, clientData: UpdateClientDto) => Promise<void>;
  removeClient: (id: number) => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  clearError: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  // État initial
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  totalClients: 0,

  // Récupérer tous les clients
  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await clientApi.getAllClients();
      set({ 
        clients, 
        totalClients: clients.length,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du chargement des clients',
        isLoading: false 
      });
    }
  },

  // Récupérer un client par ID
  fetchClientById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const client = await clientApi.getClientById(id);
      set({ selectedClient: client, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du chargement du client',
        isLoading: false 
      });
    }
  },

  // Ajouter un client
  addClient: async (clientData: CreateClientDto) => {
    set({ isLoading: true, error: null });
    try {
      const newClient = await clientApi.createClient(clientData);
      set((state) => ({ 
        clients: [newClient, ...state.clients],
        totalClients: state.totalClients + 1,
        isLoading: false 
      }));
      return newClient;
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la création du client',
        isLoading: false 
      });
      throw error;
    }
  },

  // Mettre à jour un client
  updateClient: async (id: number, clientData: UpdateClientDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedClient = await clientApi.updateClient(id, clientData);
      set((state) => ({
        clients: state.clients.map((client) => 
          client.id === id ? updatedClient : client
        ),
        selectedClient: updatedClient,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du client',
        isLoading: false 
      });
      throw error;
    }
  },

  // Supprimer un client
  removeClient: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await clientApi.deleteClient(id);
      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
        totalClients: state.totalClients - 1,
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la suppression du client',
        isLoading: false 
      });
      throw error;
    }
  },

  // Sélectionner un client
  setSelectedClient: (client: Client | null) => {
    set({ selectedClient: client });
  },

  // Effacer l'erreur
  clearError: () => {
    set({ error: null });
  }
}));

// Sélecteurs pour faciliter l'accès
export const useClients = () => useClientStore((state) => state.clients);
export const useSelectedClient = () => useClientStore((state) => state.selectedClient);
export const useClientsLoading = () => useClientStore((state) => state.isLoading);
export const useClientsError = () => useClientStore((state) => state.error);
export const useTotalClients = () => useClientStore((state) => state.totalClients);

// Sélecteurs calculés
export const useTotalSolde = () => {
  const clients = useClients();
  return clients.reduce((sum, client) => sum + client.solde, 0);
};

export const useClientStats = () => {
  const clients = useClients();
  const total = clients.length;
  const soldeTotal = clients.reduce((sum, client) => sum + client.solde, 0);
  const soldeMoyen = total > 0 ? soldeTotal / total : 0;
  
  return {
    total,
    soldeTotal,
    soldeMoyen,
    clientsParCompte: clients.reduce((acc, client) => {
      const prefix = client.numero_compte.substring(0, 5);
      acc[prefix] = (acc[prefix] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
};