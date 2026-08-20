// Minimal in-memory query engine that mimics the subset of Prisma's query
// API (`where`, `orderBy`, `skip`, `take`) actually used across the app.
// Backs lib/mock/mock-prisma.ts — see lib/prisma.ts for when it kicks in.

type Cond = Record<string, unknown>;

function matchScalar(value: unknown, condition: unknown): boolean {
  if (condition === undefined) return true;
  if (condition === null) return value === null;
  if (condition instanceof Date) {
    return value instanceof Date ? value.getTime() === condition.getTime() : value === condition;
  }
  if (typeof condition !== "object" || Array.isArray(condition)) {
    return value === condition;
  }

  const cond = condition as Cond;

  if ("equals" in cond) {
    const target = cond.equals;
    if (cond.mode === "insensitive" && typeof value === "string" && typeof target === "string") {
      return value.toLowerCase() === target.toLowerCase();
    }
    return value === target;
  }
  if ("in" in cond) return Array.isArray(cond.in) && (cond.in as unknown[]).includes(value);
  if ("notIn" in cond) return Array.isArray(cond.notIn) && !(cond.notIn as unknown[]).includes(value);
  if ("contains" in cond && typeof cond.contains === "string") {
    if (typeof value !== "string") return false;
    const hay = cond.mode === "insensitive" ? value.toLowerCase() : value;
    const needle = cond.mode === "insensitive" ? cond.contains.toLowerCase() : cond.contains;
    return hay.includes(needle);
  }
  if ("gte" in cond || "lte" in cond || "gt" in cond || "lt" in cond) {
    const toComparable = (v: unknown) => (v instanceof Date ? v.getTime() : v);
    const a = toComparable(value) as number;
    if ("gte" in cond && !(a >= (toComparable(cond.gte) as number))) return false;
    if ("lte" in cond && !(a <= (toComparable(cond.lte) as number))) return false;
    if ("gt" in cond && !(a > (toComparable(cond.gt) as number))) return false;
    if ("lt" in cond && !(a < (toComparable(cond.lt) as number))) return false;
    return true;
  }
  if ("not" in cond) return !matchScalar(value, cond.not);

  return true;
}

export function matchWhere<T extends Record<string, unknown>>(record: T, where?: Cond): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, cond]) => {
    if (key === "OR") return (cond as Cond[]).some((sub) => matchWhere(record, sub));
    if (key === "AND") return (cond as Cond[]).every((sub) => matchWhere(record, sub));
    if (key === "NOT") return !matchWhere(record, cond as Cond);
    return matchScalar(record[key], cond);
  });
}

export function sortRecords<T extends Record<string, unknown>>(
  records: T[],
  orderBy?: Record<string, "asc" | "desc">
): T[] {
  if (!orderBy) return records;
  const [key, dir] = Object.entries(orderBy)[0] ?? [];
  if (!key) return records;
  const sorted = [...records].sort((a, b) => {
    const toComparable = (v: unknown) => (v instanceof Date ? v.getTime() : v);
    const av = toComparable(a[key]);
    const bv = toComparable(b[key]);
    if (av === bv) return 0;
    return (av as number) > (bv as number) ? 1 : -1;
  });
  return dir === "desc" ? sorted.reverse() : sorted;
}

export function paginate<T>(records: T[], skip?: number, take?: number): T[] {
  const start = skip ?? 0;
  const end = take !== undefined ? start + take : undefined;
  return records.slice(start, end);
}

let idCounter = 1;
export function nextId(prefix: string): string {
  return `mock-${prefix}-${idCounter++}`;
}
