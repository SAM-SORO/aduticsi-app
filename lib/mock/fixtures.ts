// Fake seed data used only when DATABASE_URL is unset/placeholder (frontend-only dev preview).
// See lib/prisma.ts and lib/mock/mock-prisma.ts.

export const PROMO_2025 = "mock-promo-2025";
export const PROMO_2024 = "mock-promo-2024";
export const PROMO_2023 = "mock-promo-2023";
export const PROMO_2022 = "mock-promo-2022";
export const PROMO_2021 = "mock-promo-2021";

export const POSTE_PRESIDENT = "mock-poste-president";
export const POSTE_VP = "mock-poste-vp";
export const POSTE_SG = "mock-poste-sg";
export const POSTE_TRESORIER = "mock-poste-tresorier";
export const POSTE_COMM = "mock-poste-comm";

export const CAT_HACKATHON = "mock-cat-hackathon";
export const CAT_INFOS_DAY = "mock-cat-infos-day";
export const CAT_FUN_NIGHT = "mock-cat-fun-night";

export const mockPostes = [
  { id: POSTE_PRESIDENT, name: "Président", created_at: new Date("2024-09-01"), updated_at: new Date("2024-09-01") },
  { id: POSTE_VP, name: "Vice-Président", created_at: new Date("2024-09-01"), updated_at: new Date("2024-09-01") },
  { id: POSTE_SG, name: "Secrétaire Général", created_at: new Date("2024-09-01"), updated_at: new Date("2024-09-01") },
  { id: POSTE_TRESORIER, name: "Trésorier", created_at: new Date("2024-09-01"), updated_at: new Date("2024-09-01") },
  { id: POSTE_COMM, name: "Responsable Communication", created_at: new Date("2024-09-01"), updated_at: new Date("2024-09-01") },
];

export const mockPromotions = [
  { id: PROMO_2025, name: "2025", is_current_promo: true, created_at: new Date("2025-09-01"), updated_at: new Date("2025-09-01") },
  { id: PROMO_2024, name: "2024", is_current_promo: false, created_at: new Date("2024-09-01"), updated_at: new Date("2024-09-01") },
  { id: PROMO_2023, name: "2023", is_current_promo: false, created_at: new Date("2023-09-01"), updated_at: new Date("2023-09-01") },
  { id: PROMO_2022, name: "2022", is_current_promo: false, created_at: new Date("2022-09-01"), updated_at: new Date("2022-09-01") },
  { id: PROMO_2021, name: "2021", is_current_promo: false, created_at: new Date("2021-09-01"), updated_at: new Date("2021-09-01") },
];

export const mockActivityCategories = [
  { id: CAT_HACKATHON, name: "Hackathon", slug: "hackathon", created_at: new Date("2024-01-10") },
  { id: CAT_INFOS_DAY, name: "Info's Day", slug: "infos-day", created_at: new Date("2024-01-11") },
  { id: CAT_FUN_NIGHT, name: "Fun Night", slug: "fun-night", created_at: new Date("2024-01-12") },
];

const now = new Date();

export const mockMembers = [
  {
    id: "mock-member-1", email: "aya.kouassi@aduti.dev", first_name: "Aya", last_name: "Kouassi",
    promo_id: PROMO_2025, role: "ADMIN" as const, function: "GESTION_ACTIVITES" as const, status: "STUDENT" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: POSTE_PRESIDENT, gender: "FEMALE" as const,
    photo_url: null, description: "Présidente de l'ADUTI, passionnée de dev web et d'IA.",
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: "aya-kouassi", github_url: "ayakouassi",
    current_job_title: null, current_job_description: null, slug: "aya-kouassi",
    created_at: now, updated_at: now,
  },
  {
    id: "mock-member-2", email: "jeanmarc.yao@aduti.dev", first_name: "Jean-Marc", last_name: "Yao",
    promo_id: PROMO_2025, role: "ADMIN" as const, function: "NONE" as const, status: "STUDENT" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: POSTE_VP, gender: "MALE" as const,
    photo_url: null, description: "Vice-président, focus réseau et cybersécurité.",
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: "jean-marc-yao", github_url: null,
    current_job_title: null, current_job_description: null, slug: "jean-marc-yao",
    created_at: now, updated_at: now,
  },
  {
    id: "mock-member-3", email: "fatou.diabate@aduti.dev", first_name: "Fatou", last_name: "Diabaté",
    promo_id: PROMO_2024, role: "MEMBER" as const, function: "NONE" as const, status: "STUDENT" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: POSTE_SG, gender: "FEMALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: null, github_url: null,
    current_job_title: null, current_job_description: null, slug: "fatou-diabate",
    created_at: now, updated_at: now,
  },
  {
    id: "mock-member-4", email: "kouadio.nguessan@aduti.dev", first_name: "Kouadio", last_name: "N'Guessan",
    promo_id: PROMO_2024, role: "MEMBER" as const, function: "NONE" as const, status: "STUDENT" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: POSTE_TRESORIER, gender: "MALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: null, github_url: "kouadion",
    current_job_title: null, current_job_description: null, slug: "kouadio-nguessan",
    created_at: now, updated_at: now,
  },
  {
    id: "mock-member-5", email: "aicha.traore@aduti.dev", first_name: "Aïcha", last_name: "Traoré",
    promo_id: PROMO_2024, role: "MEMBER" as const, function: "NONE" as const, status: "STUDENT" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "FEMALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: null, github_url: null,
    current_job_title: null, current_job_description: null, slug: "aicha-traore",
    created_at: now, updated_at: now,
  },
  {
    id: "mock-member-6", email: "yves.brou@aduti.dev", first_name: "Yves", last_name: "Brou",
    promo_id: PROMO_2023, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "MALE" as const,
    photo_url: null, description: "Développeur passionné de systèmes distribués.",
    phone: null, portfolio_url: "https://yvesbrou.dev", youtube_url: null, linkedin_url: "yves-brou", github_url: "yvesbrou",
    current_job_title: "Développeur Full-Stack", current_job_description: "Conception et maintenance d'applications web chez Orange CI, stack Node.js / React.",
    slug: "yves-brou", created_at: now, updated_at: now,
  },
  {
    id: "mock-member-7", email: "prisca.assi@aduti.dev", first_name: "Prisca", last_name: "Assi",
    promo_id: PROMO_2023, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "FEMALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: "prisca-assi", github_url: null,
    current_job_title: "Data Analyst", current_job_description: "Analyse de données et reporting BI pour la direction financière de MTN CI.",
    slug: "prisca-assi", created_at: now, updated_at: now,
  },
  {
    id: "mock-member-8", email: "marc.koffi@aduti.dev", first_name: "Marc-Aurèle", last_name: "Koffi",
    promo_id: PROMO_2022, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "MALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: null, github_url: "makoffi",
    current_job_title: "Ingénieur DevOps", current_job_description: "Infrastructure cloud et CI/CD pour une scale-up fintech.",
    slug: "marc-aurele-koffi", created_at: now, updated_at: now,
  },
  {
    id: "mock-member-9", email: "nadege.kacou@aduti.dev", first_name: "Nadège", last_name: "Kacou",
    promo_id: PROMO_2022, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "FEMALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: "nadege-kacou", github_url: null,
    current_job_title: "Cheffe de Projet IT", current_job_description: null,
    slug: "nadege-kacou", created_at: now, updated_at: now,
  },
  {
    id: "mock-member-10", email: "constance.bahi@aduti.dev", first_name: "Constance", last_name: "Bahi",
    promo_id: PROMO_2021, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "FEMALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: null, github_url: null,
    current_job_title: "Cheffe de Produit", current_job_description: null,
    slug: "constance-bahi", created_at: now, updated_at: now,
  },
  {
    id: "mock-member-11", email: "salif.diomande@aduti.dev", first_name: "Salif", last_name: "Diomandé",
    promo_id: PROMO_2021, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "MALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: "salif-diomande", github_url: "sdiomande",
    current_job_title: "Consultant Cybersécurité", current_job_description: "Audits de sécurité et pentests pour des clients bancaires.",
    slug: "salif-diomande", created_at: now, updated_at: now,
  },
  {
    id: "mock-member-12", email: "awa.ouattara@aduti.dev", first_name: "Awa", last_name: "Ouattara",
    promo_id: PROMO_2025, role: "MEMBER" as const, function: "NONE" as const, status: "STUDENT" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: POSTE_COMM, gender: "FEMALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: null, github_url: null,
    current_job_title: null, current_job_description: null, slug: "awa-ouattara",
    created_at: now, updated_at: now,
  },
  {
    id: "mock-member-13", email: "herve.kra@aduti.dev", first_name: "Hervé", last_name: "Kra",
    promo_id: PROMO_2023, role: "MEMBER" as const, function: "NONE" as const, status: "ALUMNI" as const,
    registration_status: "APPROVED" as const, profile_status: "PUBLIC" as const, poste_id: null, gender: "MALE" as const,
    photo_url: null, description: null,
    phone: null, portfolio_url: null, youtube_url: null, linkedin_url: "herve-kra", github_url: "hkra",
    current_job_title: "Ingénieur Cloud", current_job_description: "Architecture AWS pour des clients internationaux.",
    slug: "herve-kra", created_at: now, updated_at: now,
  },
];

export const mockActivities = [
  {
    id: "mock-activity-hackathon-2025", title: "Hackathon ADUTI 2025",
    description: "48h de code intensif pour résoudre les défis technologiques de demain, en équipes mixtes étudiants-alumni.",
    promo_id: PROMO_2025, category_id: CAT_HACKATHON, image_url: "/activities/ctf.png",
    created_by: "mock-member-1", date: new Date("2025-03-15"), created_at: new Date("2025-01-05"), updated_at: new Date("2025-03-16"),
  },
  {
    id: "mock-activity-infosday-2025", title: "Info's Day 2025",
    description: "Journée de promotion de la filière STIC et conférences Tech pour les nouveaux talents de l'INP-HB.",
    promo_id: PROMO_2025, category_id: CAT_INFOS_DAY, image_url: "/activities/info_day.png",
    created_by: "mock-member-2", date: new Date("2025-02-10"), created_at: new Date("2025-01-02"), updated_at: new Date("2025-02-11"),
  },
  {
    id: "mock-activity-funnight-2025", title: "Fun Night Intégration",
    description: "Soirée de cohésion pour accueillir la nouvelle promotion et renforcer les liens intergénérationnels.",
    promo_id: PROMO_2025, category_id: CAT_FUN_NIGHT, image_url: "/activities/fun_night.png",
    created_by: "mock-member-12", date: new Date("2024-10-05"), created_at: new Date("2024-09-20"), updated_at: new Date("2024-10-06"),
  },
  {
    id: "mock-activity-hackathon-2024", title: "Hackathon ADUTI 2024",
    description: "Compétition de développement autour de l'IA appliquée aux problématiques locales.",
    promo_id: PROMO_2024, category_id: CAT_HACKATHON, image_url: "/activities/ctf.png",
    created_by: "mock-member-3", date: new Date("2024-03-20"), created_at: new Date("2024-01-10"), updated_at: new Date("2024-03-21"),
  },
  {
    id: "mock-activity-infosday-2024", title: "Info's Day 2024",
    description: "Présentation des débouchés de la filière informatique STIC aux futurs bacheliers.",
    promo_id: PROMO_2024, category_id: CAT_INFOS_DAY, image_url: "/activities/info_day.png",
    created_by: "mock-member-4", date: new Date("2024-02-14"), created_at: new Date("2024-01-03"), updated_at: new Date("2024-02-15"),
  },
  {
    id: "mock-activity-networking-2023", title: "Soirée Networking Alumni",
    description: "Rencontre annuelle entre alumni et étudiants pour échanger sur les parcours professionnels.",
    promo_id: PROMO_2023, category_id: CAT_FUN_NIGHT, image_url: null,
    created_by: "mock-member-6", date: new Date("2023-11-20"), created_at: new Date("2023-10-15"), updated_at: new Date("2023-11-21"),
  },
];

export const mockPublications = [
  {
    id: "mock-pub-1", title: "Résultats du Hackathon 2025",
    content: "Félicitations à l'équipe gagnante 'ByteForce' pour leur solution de gestion des files d'attente hospitalières !",
    images: [] as string[], activity_id: "mock-activity-hackathon-2025", created_by: "mock-member-1",
    date: new Date("2025-03-17"), created_at: new Date("2025-03-17"), updated_at: new Date("2025-03-17"),
  },
  {
    id: "mock-pub-2", title: "Ouverture des inscriptions",
    content: "Les inscriptions pour le Hackathon ADUTI 2025 sont désormais ouvertes. Places limitées à 20 équipes.",
    images: [] as string[], activity_id: "mock-activity-hackathon-2025", created_by: "mock-member-1",
    date: new Date("2025-02-01"), created_at: new Date("2025-02-01"), updated_at: new Date("2025-02-01"),
  },
];

export const mockPartners = [
  { id: "mock-partner-1", name: "PARACLET", logo_url: "/images/landing/partners/paraclet.png", is_active: true, created_at: new Date("2024-01-01"), updated_at: new Date("2024-01-01") },
  { id: "mock-partner-2", name: "QALILAB", logo_url: "/images/landing/partners/qalilab.webp", is_active: true, created_at: new Date("2024-01-02"), updated_at: new Date("2024-01-02") },
  { id: "mock-partner-3", name: "CSI", logo_url: "/images/landing/partners/csi.png", is_active: true, created_at: new Date("2024-01-03"), updated_at: new Date("2024-01-03") },
];

export const mockContactMessages: {
  id: string; email?: string | null; phone?: string | null; name: string;
  subject: string; message: string; ip_address?: string | null; created_at: Date;
}[] = [];
