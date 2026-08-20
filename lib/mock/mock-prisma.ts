// Drop-in stand-in for `prisma` (subset of the Prisma Client API actually
// used by the app) backed by the in-memory fixtures in lib/mock/fixtures.ts.
// Only used when DATABASE_URL is missing/placeholder — see lib/prisma.ts.
//
// Relations are always eagerly attached regardless of `include`/`select`,
// and `select` does not prune fields: callers only ever read specific
// properties off the result, so extra fields are harmless.

import { matchWhere, sortRecords, paginate, nextId } from "./engine";
import {
  mockPostes,
  mockPromotions,
  mockActivityCategories,
  mockMembers,
  mockActivities,
  mockPublications,
  mockPartners,
  mockContactMessages,
} from "./fixtures";

type Args = {
  where?: Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">;
  skip?: number;
  take?: number;
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

// Mutable in-memory copies so create/update/delete persist for the dev session.
const postes = [...mockPostes];
const promotions = [...mockPromotions];
const categories = [...mockActivityCategories];
const members = [...mockMembers];
const activities = [...mockActivities];
const publications = [...mockPublications];
const partners = [...mockPartners];
const contactMessages = [...mockContactMessages];

function withPromotion<T extends { promo_id: string }>(record: T) {
  return { ...record, promotion: promotions.find((p) => p.id === record.promo_id) ?? null };
}
function withPoste<T extends { poste_id: string | null }>(record: T) {
  return { ...record, poste: record.poste_id ? postes.find((p) => p.id === record.poste_id) ?? null : null };
}
function withMemberRelations<T extends { promo_id: string; poste_id: string | null }>(record: T) {
  return withPoste(withPromotion(record));
}
function withPromotionCount<T extends { id: string }>(record: T) {
  return { ...record, _count: { activities: activities.filter((a) => a.promo_id === record.id).length } };
}
function withActivityRelations<T extends { id: string; promo_id: string; category_id: string | null }>(record: T) {
  return {
    ...record,
    promotion: promotions.find((p) => p.id === record.promo_id) ?? null,
    category: record.category_id ? categories.find((c) => c.id === record.category_id) ?? null : null,
    publications: sortRecords(
      publications.filter((p) => p.activity_id === record.id),
      { created_at: "desc" }
    ),
    _count: { publications: publications.filter((p) => p.activity_id === record.id).length },
  };
}

export const mockPrisma = {
  poste: {
    findMany: (args?: Args) =>
      paginate(sortRecords(postes.filter((p) => matchWhere(p, args?.where)), args?.orderBy), args?.skip, args?.take),
    findUnique: (args?: Args) => postes.find((p) => matchWhere(p, args?.where)) ?? null,
  },

  promotion: {
    findMany: (args?: Args) => {
      const result = paginate(
        sortRecords(promotions.filter((p) => matchWhere(p, args?.where)), args?.orderBy),
        args?.skip,
        args?.take
      );
      return result.map(withPromotionCount);
    },
    findFirst: (args?: Args) => {
      const found = promotions.find((p) => matchWhere(p, args?.where));
      return found ? withPromotionCount(found) : null;
    },
    count: (args?: Args) => promotions.filter((p) => matchWhere(p, args?.where)).length,
  },

  activityCategory: {
    findMany: (args?: Args) =>
      paginate(sortRecords(categories.filter((c) => matchWhere(c, args?.where)), args?.orderBy), args?.skip, args?.take),
    findFirst: (args?: Args) => categories.find((c) => matchWhere(c, args?.where)) ?? null,
    create: ({ data }: Args) => {
      const rec = { id: nextId("cat"), created_at: new Date(), ...(data as { name: string; slug: string }) };
      categories.push(rec);
      return rec;
    },
  },

  member: {
    findMany: (args?: Args) => {
      const result = paginate(
        sortRecords(members.filter((m) => matchWhere(m, args?.where)), args?.orderBy),
        args?.skip,
        args?.take
      );
      return result.map(withMemberRelations);
    },
    findFirst: (args?: Args) => {
      const found = members.find((m) => matchWhere(m, args?.where));
      return found ? withMemberRelations(found) : null;
    },
    findUnique: (args?: Args) => {
      const found = members.find((m) => matchWhere(m, args?.where));
      return found ? withMemberRelations(found) : null;
    },
    count: (args?: Args) => members.filter((m) => matchWhere(m, args?.where)).length,
    update: ({ where, data }: Args) => {
      const idx = members.findIndex((m) => matchWhere(m, where));
      if (idx === -1) throw new Error("Mock DB: member not found");
      members[idx] = { ...members[idx], ...data, updated_at: new Date() } as (typeof members)[number];
      return withMemberRelations(members[idx]);
    },
    create: ({ data }: Args) => {
      const rec = {
        id: nextId("member"),
        created_at: new Date(),
        updated_at: new Date(),
        ...(data as (typeof members)[number]),
      };
      members.push(rec);
      return withMemberRelations(rec);
    },
  },

  activity: {
    findMany: (args?: Args) => {
      const result = paginate(
        sortRecords(activities.filter((a) => matchWhere(a, args?.where)), args?.orderBy),
        args?.skip,
        args?.take
      );
      return result.map(withActivityRelations);
    },
    findUnique: (args?: Args) => {
      const found = activities.find((a) => matchWhere(a, args?.where));
      return found ? withActivityRelations(found) : null;
    },
    count: (args?: Args) => activities.filter((a) => matchWhere(a, args?.where)).length,
  },

  publication: {
    findMany: (args?: Args) =>
      paginate(sortRecords(publications.filter((p) => matchWhere(p, args?.where)), args?.orderBy), args?.skip, args?.take),
  },

  partner: {
    findMany: (args?: Args) =>
      paginate(sortRecords(partners.filter((p) => matchWhere(p, args?.where)), args?.orderBy), args?.skip, args?.take),
  },

  contactMessage: {
    count: (args?: Args) => contactMessages.filter((c) => matchWhere(c, args?.where)).length,
    findMany: (args?: Args) =>
      paginate(sortRecords(contactMessages.filter((c) => matchWhere(c, args?.where)), args?.orderBy), args?.skip, args?.take),
    create: ({ data }: Args) => {
      const rec = { id: nextId("msg"), created_at: new Date(), ...(data as (typeof contactMessages)[number]) };
      contactMessages.push(rec);
      return rec;
    },
  },
};
