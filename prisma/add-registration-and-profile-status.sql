-- Ajout de registration_status et profile_status sur "Member".
-- Les membres deja presents sont approuves : le defaut PENDING ne vaut que
-- pour les inscriptions futures sans lien d'invitation.
-- Idempotent : rejouable sans effet de bord.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RegistrationStatus') THEN
    CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProfileStatus') THEN
    CREATE TYPE "ProfileStatus" AS ENUM ('PRIVATE', 'PUBLIC');
  END IF;
END $$;

-- Colonne ajoutee sans defaut : les lignes existantes restent NULL le temps
-- de l'UPDATE, jamais PENDING.
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "registration_status" "RegistrationStatus";
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "profile_status" "ProfileStatus";

UPDATE "Member" SET "registration_status" = 'APPROVED' WHERE "registration_status" IS NULL;
UPDATE "Member" SET "profile_status" = 'PUBLIC' WHERE "profile_status" IS NULL;

ALTER TABLE "Member" ALTER COLUMN "registration_status" SET DEFAULT 'PENDING';
ALTER TABLE "Member" ALTER COLUMN "registration_status" SET NOT NULL;
ALTER TABLE "Member" ALTER COLUMN "profile_status" SET DEFAULT 'PUBLIC';
ALTER TABLE "Member" ALTER COLUMN "profile_status" SET NOT NULL;

COMMIT;

SELECT "registration_status", "profile_status", COUNT(*)
FROM "Member" GROUP BY 1, 2;
