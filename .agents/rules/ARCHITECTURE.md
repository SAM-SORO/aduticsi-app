
Le projet utilise Supabase comme infrastructure backend
et Prisma comme couche d’accès aux données côté serveur.


exemple d'architecture 

src/
│
├── app/                    → Pages Next.js (App Router)
│
├── components/             → Composants UI
│   ├── ui/                 → shadcn components
│   └── custom/             → composants métiers
│
├── services/               → Communication base de données
│   ├── member.service.ts
│   ├── activity.service.ts
│   ├── promo.service.ts
│
├── lib/                    → Config et utilitaires
│   ├── supabase.ts
│   ├── prisma.ts
│   ├── utils.ts
│
├── schemas/                → Validation Zod
│   ├── member.schema.ts
│   ├── activity.schema.ts
│   ├── promo.schema.ts
│
├── types/                  → Types TypeScript globaux
│
├── hooks/                  → Hooks React personnalisés
│
├── constants/              → Constantes projet
│
├── middleware/             → Sécurité / Auth
│
└── config/                 → Config globale projet



Frontend (Next.js)
       ↓
Server Actions / API Routes
       ↓
Prisma ORM
       ↓
Base Supabase (PostgreSQL)


/src
 ├─ /components   # Composants UI (shadcn/ui)
 ├─ /icons        # Icônes lucide
 ├─ /layouts      # Layouts globaux
 ├─ /pages        # Pages Next.js
 ├─ /services     # Communication Supabase/Prisma
 ├─ /schemas      # Schémas Zod
 └─ /utils        # Fonctions utilitaires