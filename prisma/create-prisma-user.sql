-- Script SQL pour créer l'utilisateur Prisma dans Supabase
-- À exécuter dans le SQL Editor de Supabase Dashboard

-- 1. Créer l'utilisateur prisma avec un mot de passe sécurisé
CREATE USER "prisma" WITH PASSWORD 'Clover@@MyPg@db15' BYPASSRLS CREATEDB;

-- 2. Étendre les privilèges de prisma à postgres (nécessaire pour voir les changements dans le Dashboard)
GRANT "prisma" TO "postgres";

-- 3. Accorder les permissions nécessaires sur le schéma public
GRANT USAGE ON SCHEMA public TO prisma;
GRANT CREATE ON SCHEMA public TO prisma;
GRANT ALL ON ALL TABLES IN SCHEMA public TO prisma;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO prisma;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO prisma;

-- 4. Définir les privilèges par défaut pour les futurs objets
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO prisma;

-- ✅ Une fois ce script exécuté, l'utilisateur prisma sera prêt à être utilisé par Prisma ORM
