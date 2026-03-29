export interface Versement {
  numero_versement: string;
  numero_cheque: string;
  montant: number;
  clientId: string;
  createdAt?: string;
  client?: {
    numero_compte: string;
    nom_client: string;
    solde: number;
  };
}

export interface CreateVersementDto {
  numero_versement: string;
  numero_cheque: string;
  montant: number;
  clientId: string;
}

export interface UpdateVersementDto {
  numero_cheque?: string;
  montant?: number;
}
