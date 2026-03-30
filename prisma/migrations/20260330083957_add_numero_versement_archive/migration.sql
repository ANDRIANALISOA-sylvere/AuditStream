-- Ajouter la colonne archive
ALTER TABLE "Audit_Versement" ADD COLUMN "numero_versement_archive" TEXT;

-- Mettre à jour le trigger pour toujours renseigner cette colonne
CREATE OR REPLACE FUNCTION audit_versement_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id INT;
BEGIN
  BEGIN
    v_user_id := current_setting('app.current_user_id')::INT;
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "Audit_Versement" (
      type_action, "versementId", "numero_versement_archive", "numero_compte",
      nom_client, montant_ancien, montant_nouveau,
      "utilisateurId", date_operation
    )
    SELECT 'INSERT'::"ActionType",
      NEW.numero_versement, NEW.numero_versement, NEW."clientId",
      c.nom_client, NULL, NEW.montant,
      v_user_id, NOW()
    FROM "Client" c WHERE c.numero_compte = NEW."clientId";

  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "Audit_Versement" (
      type_action, "versementId", "numero_versement_archive", "numero_compte",
      nom_client, montant_ancien, montant_nouveau,
      "utilisateurId", date_operation
    )
    SELECT 'UPDATE'::"ActionType",
      NEW.numero_versement, NEW.numero_versement, NEW."clientId",
      c.nom_client, OLD.montant, NEW.montant,
      v_user_id, NOW()
    FROM "Client" c WHERE c.numero_compte = NEW."clientId";

  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "Audit_Versement" (
      type_action, "versementId", "numero_versement_archive", "numero_compte",
      nom_client, montant_ancien, montant_nouveau,
      "utilisateurId", date_operation
    )
    SELECT 'DELETE'::"ActionType",
      NULL,                       
      OLD.numero_versement,       
      OLD."clientId",
      c.nom_client, OLD.montant, NULL,
      v_user_id, NOW()
    FROM "Client" c WHERE c.numero_compte = OLD."clientId";
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;