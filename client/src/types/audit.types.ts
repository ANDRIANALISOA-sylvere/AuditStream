export interface AuditVersement {
  id: number;
  type_action: 'INSERT' | 'UPDATE' | 'DELETE';
  date_operation: string;
  versementId: string | null;
  numero_versement_archive: string | null;
  numero_compte: string | null;
  nom_client: string;
  montant_ancien: number | null;
  montant_nouveau: number | null;
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
}
