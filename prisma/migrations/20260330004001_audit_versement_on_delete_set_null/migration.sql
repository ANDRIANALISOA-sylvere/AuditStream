-- Supprimer l'ancienne contrainte
ALTER TABLE "Audit_Versement" DROP CONSTRAINT "Audit_Versement_versementId_fkey";

-- Recréer en DEFERRABLE INITIALLY DEFERRED
ALTER TABLE "Audit_Versement" ADD CONSTRAINT "Audit_Versement_versementId_fkey"
  FOREIGN KEY ("versementId")
  REFERENCES "Versement"("numero_versement")
  ON DELETE SET NULL
  ON UPDATE CASCADE
  DEFERRABLE INITIALLY DEFERRED;