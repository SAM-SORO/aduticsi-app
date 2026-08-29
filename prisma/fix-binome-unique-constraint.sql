-- Un filleul ne pouvait avoir qu'un seul parrain, ce qui rend le tirage
-- impossible des que les parrains sont plus nombreux que les filleuls.
-- L'unicite porte desormais sur le couple.
-- Idempotent : rejouable sans effet de bord.

BEGIN;

ALTER TABLE "Binome" DROP CONSTRAINT IF EXISTS "Binome_filleul_id_promo_combo_key";

CREATE UNIQUE INDEX IF NOT EXISTS "Binome_parrain_id_filleul_id_promo_combo_key"
  ON "Binome" ("parrain_id", "filleul_id", "promo_combo");

CREATE INDEX IF NOT EXISTS "Binome_filleul_id_idx" ON "Binome" ("filleul_id");

COMMIT;

SELECT indexname FROM pg_indexes WHERE tablename = 'Binome';
