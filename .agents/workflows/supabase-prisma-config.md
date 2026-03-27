---
description: Configuration Supabase + Prisma 7 — règles à ne jamais modifier
---

# ⚠️ RÈGLE CRITIQUE — Configuration Prisma + Supabase

> **NE JAMAIS modifier les fichiers suivants sans lire ce document entièrement.**

## Fichiers concernés

- `lib/prisma.ts`
- `prisma/schema.prisma` (bloc `datasource db`)
- `.env.local` (variables `DATABASE_URL`, `DIRECT_URL`)

---

## 1. Versions installées

- **Prisma** : `7.3.0`
- **@prisma/adapter-pg** : installé (requis par Prisma 7)
- **pg** : installé (driver PostgreSQL natif)

---

## 2. Règle absolue — Prisma 7 exige un Driver Adapter

Dans Prisma 7, `new PrismaClient()` sans adapter **plantera** avec :
```
PrismaClientConstructorValidationError: Using engine type "client" requires either "adapter" or "accelerateUrl"
```

Le `lib/prisma.ts` **doit** toujours utiliser ce pattern :

```typescript
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // OBLIGATOIRE pour Supabase SSL
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

> ⛔ Ne jamais supprimer `ssl: { rejectUnauthorized: false }` — sans ça, la connexion SSL Supabase échoue avec P1001.

---

## 3. URLs de connexion

La seule URL accessible depuis le réseau de développement est le **pgBouncer pooler Supabase en mode Transaction (port 6543)**. Les autres modes ont été testés et échouent :

| URL | Port | Résultat |
|---|---|---|
| `aws-1-eu-west-1.pooler.supabase.com` | **6543** + `?pgbouncer=true` | ✅ **FONCTIONNE** |
| `aws-1-eu-west-1.pooler.supabase.com` | 5432 (session) | ❌ P1001 |
| `db.nqofzuoozxnwyylxidne.supabase.co` | 5432 (direct) | ❌ P1001 |

### .env.local obligatoire

```env
DATABASE_URL="postgresql://prisma.nqofzuoozxnwyylxidne:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://prisma.nqofzuoozxnwyylxidne:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

- `DATABASE_URL` → utilisé par l'adapter `pg Pool` pour **toutes les requêtes runtime**
- `DIRECT_URL` → utilisé par `prisma db push` / migrations uniquement

---

## 4. schema.prisma — bloc datasource (Prisma 7.5+)

Depuis Prisma 7.5.0, avec `@prisma/config`, les URLs de connexion **doivent être retirées** du schéma car elles sont centralisées dans `prisma.config.ts`.

```prisma
datasource db {
  provider = "postgresql"
}
```

> ⛔ **Ne pas définir** `url` ni `directUrl` dans le schéma si `prisma.config.ts` existe. Le CLI refusera la génération avec l'erreur P1012.

---

## 5. Commandes de maintenance

Après tout changement de schéma Prisma :
```bash
npx prisma generate
npx prisma db push
```

> `db push` utilise `DIRECT_URL` (session mode 5432) pour les DDL.
> Les requêtes runtime utilisent `DATABASE_URL` (transaction mode 6543).
