// Type pour un client
export interface Client {
  id: number;
  numero_compte: string;
  nom_client: string;
  solde: number;
  createdAt?: string;
  updatedAt?: string;
}

// DTO pour créer un client
export interface CreateClientDto {
  numero_compte: string;
  nom_client: string;
  solde: number;
}

// DTO pour mettre à jour un client
export interface UpdateClientDto {
  numero_compte?: string;
  nom_client?: string;
  solde?: number;
}

// Réponse API pour la liste des clients
export interface ClientListResponse {
  data: Client[];
  total?: number;
}

// Réponse API pour un client
export interface ClientResponse {
  data: Client;
  message?: string;
}