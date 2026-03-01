import { useEffect } from 'react';
import { useClientStore } from '@/store/clientStore';

export const useClients = () => {
  const {
    clients,
    selectedClient,
    isLoading,
    error,
    totalClients,
    fetchClients,
    fetchClientById,
    addClient,
    updateClient,
    removeClient,
    setSelectedClient,
    clearError,
  } = useClientStore();

  // Charger les clients au montage
  useEffect(() => {
    fetchClients();
  }, []);

  // Rechercher un client par nom ou numéro de compte
  const searchClients = (searchTerm: string) => {
    if (!searchTerm) return clients;

    const term = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.nom_client.toLowerCase().includes(term) ||
        client.numero_compte.toLowerCase().includes(term),
    );
  };

  // Obtenir les clients avec solde > seuil
  const getClientsWithSoldeAbove = (seuil: number) => {
    return clients.filter((client) => client.solde > seuil);
  };

  // Obtenir les clients avec solde < seuil
  const getClientsWithSoldeBelow = (seuil: number) => {
    return clients.filter((client) => client.solde < seuil);
  };

  return {
    // Données
    clients,
    selectedClient,
    isLoading,
    error,
    totalClients,

    // Actions CRUD
    fetchClients,
    fetchClientById,
    addClient,
    updateClient,
    removeClient,
    setSelectedClient,
    clearError,

    // Helpers
    searchClients,
    getClientsWithSoldeAbove,
    getClientsWithSoldeBelow,
  };
};
