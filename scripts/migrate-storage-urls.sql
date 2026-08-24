-- =============================================================================
--  Réécriture des URLs Supabase Storage : Cloud  ->  self-hosted
-- =============================================================================
--  Contexte : getPublicUrl() persiste une URL ABSOLUE en base. Après la bascule
--  vers l'instance self-hosted, les lignes existantes pointent encore vers
--  l'ancien projet Cloud. Ce script réécrit uniquement le préfixe de domaine ;
--  le chemin (/storage/v1/object/public/<bucket>/<fichier>) reste identique.
--
--  ⚠️  AVANT D'EXÉCUTER :
--      1. Faire un dump :  pg_dump "<DATABASE_URL>" > backup-avant-migration.sql
--      2. Vérifier que les 5 buckets existent bien côté self-hosted
--         et qu'ils sont marqués PUBLIC (sinon les URLs renverront du 400).
--
--  Exécution :  psql "<DATABASE_URL_SELF_HOSTED>" -f scripts/migrate-storage-urls.sql
--
--  Colonnes concernées :
--      "Member".photo_url        (bucket membres_images, sous-dossier avatars/)
--      "Activity".image_url      (bucket activity_images)
--      "Publication".images[]    (bucket publications_images)
--      "Partner".logo_url        (bucket partenaires_logo)
--
--  NON concernées (liens externes saisis par les membres, à ne PAS toucher) :
--      "Member".portfolio_url / youtube_url / linkedin_url / github_url
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. État AVANT — nombre de lignes qui pointent encore vers le Cloud
-- -----------------------------------------------------------------------------
\echo '--- AVANT migration ---'

SELECT 'Member.photo_url'   AS colonne, count(*) AS a_migrer
  FROM "Member"
 WHERE photo_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%'
UNION ALL
SELECT 'Activity.image_url', count(*)
  FROM "Activity"
 WHERE image_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%'
UNION ALL
SELECT 'Publication.images', count(*)
  FROM "Publication"
 WHERE EXISTS (
       SELECT 1 FROM unnest(images) AS img
        WHERE img LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%')
UNION ALL
SELECT 'Partner.logo_url', count(*)
  FROM "Partner"
 WHERE logo_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%';

-- -----------------------------------------------------------------------------
-- 2. Réécriture
-- -----------------------------------------------------------------------------

UPDATE "Member"
   SET photo_url = replace(photo_url,
                           'https://nqofzuoozxnwyylxidne.supabase.co',
                           'https://supabase.aduticsi.com')
 WHERE photo_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%';

UPDATE "Activity"
   SET image_url = replace(image_url,
                           'https://nqofzuoozxnwyylxidne.supabase.co',
                           'https://supabase.aduticsi.com')
 WHERE image_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%';

-- Tableau text[] : on reconstruit l'array en préservant STRICTEMENT l'ordre
-- (WITH ORDINALITY + ORDER BY) — l'ordre des images pilote l'affichage de la galerie.
UPDATE "Publication"
   SET images = ARRAY(
         SELECT replace(t.img,
                        'https://nqofzuoozxnwyylxidne.supabase.co',
                        'https://supabase.aduticsi.com')
           FROM unnest(images) WITH ORDINALITY AS t(img, ord)
          ORDER BY t.ord
       )
 WHERE EXISTS (
       SELECT 1 FROM unnest(images) AS img
        WHERE img LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%');

UPDATE "Partner"
   SET logo_url = replace(logo_url,
                          'https://nqofzuoozxnwyylxidne.supabase.co',
                          'https://supabase.aduticsi.com')
 WHERE logo_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%';

-- -----------------------------------------------------------------------------
-- 3. État APRÈS — doit renvoyer 0 partout dans "restant_cloud"
-- -----------------------------------------------------------------------------
\echo '--- APRES migration ---'

SELECT 'Member.photo_url'   AS colonne,
       count(*) FILTER (WHERE photo_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%') AS restant_cloud,
       count(*) FILTER (WHERE photo_url LIKE 'https://supabase.aduticsi.com%')            AS migre_ok
  FROM "Member"
UNION ALL
SELECT 'Activity.image_url',
       count(*) FILTER (WHERE image_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%'),
       count(*) FILTER (WHERE image_url LIKE 'https://supabase.aduticsi.com%')
  FROM "Activity"
UNION ALL
SELECT 'Publication.images',
       count(*) FILTER (WHERE EXISTS (SELECT 1 FROM unnest(images) AS i
                                       WHERE i LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%')),
       count(*) FILTER (WHERE EXISTS (SELECT 1 FROM unnest(images) AS i
                                       WHERE i LIKE 'https://supabase.aduticsi.com%'))
  FROM "Publication"
UNION ALL
SELECT 'Partner.logo_url',
       count(*) FILTER (WHERE logo_url LIKE 'https://nqofzuoozxnwyylxidne.supabase.co%'),
       count(*) FILTER (WHERE logo_url LIKE 'https://supabase.aduticsi.com%')
  FROM "Partner";

-- -----------------------------------------------------------------------------
--  Si "restant_cloud" vaut 0 partout  ->  COMMIT ;
--  Sinon                              ->  ROLLBACK ;
-- -----------------------------------------------------------------------------
COMMIT;
