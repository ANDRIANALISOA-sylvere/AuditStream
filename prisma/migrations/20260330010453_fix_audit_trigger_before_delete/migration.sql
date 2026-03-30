DROP TRIGGER IF EXISTS trg_audit_versement ON "Versement";
DROP FUNCTION IF EXISTS audit_versement_trigger();

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
      type_action, "versementId", "numero_compte",
      nom_client, montant_ancien, montant_nouveau,
      "utilisateurId", date_operation
    )
    SELECT 'INSERT'::"ActionType",
      NEW.numero_versement, NEW."clientId",
      c.nom_client, NULL, NEW.montant,
      v_user_id, NOW()
    FROM "Client" c WHERE c.numero_compte = NEW."clientId";

  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "Audit_Versement" (
      type_action, "versementId", "numero_compte",
      nom_client, montant_ancien, montant_nouveau,
      "utilisateurId", date_operation
    )
    SELECT 'UPDATE'::"ActionType",
      NEW.numero_versement, NEW."clientId",
      c.nom_client, OLD.montant, NEW.montant,
      v_user_id, NOW()
    FROM "Client" c WHERE c.numero_compte = NEW."clientId";

  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "Audit_Versement" (
      type_action, "versementId", "numero_compte",
      nom_client, montant_ancien, montant_nouveau,
      "utilisateurId", date_operation
    )
    SELECT 'DELETE'::"ActionType",
      NULL,
      OLD."clientId",
      c.nom_client, OLD.montant, NULL,
      v_user_id, NOW()
    FROM "Client" c WHERE c.numero_compte = OLD."clientId";
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- AFTER pour INSERT et UPDATE
CREATE TRIGGER trg_audit_versement_insert_update
AFTER INSERT OR UPDATE
ON "Versement"
FOR EACH ROW EXECUTE FUNCTION audit_versement_trigger();

-- BEFORE pour DELETE
CREATE TRIGGER trg_audit_versement_delete
BEFORE DELETE
ON "Versement"
FOR EACH ROW EXECUTE FUNCTION audit_versement_trigger();-- This is an empty migration.