/**
 * Réécrit les URLs Supabase Storage (Cloud -> self-hosted) via PostgREST.
 *
 *   node scripts/migrate-storage-urls.mjs           # dry-run (aucune écriture)
 *   node scripts/migrate-storage-urls.mjs --apply   # applique les modifications
 *
 * Alternative sans réseau : scripts/migrate-storage-urls.sql (à jouer dans le SQL Editor).
 */
import { readFileSync } from 'node:fs';

const OLD = 'https://nqofzuoozxnwyylxidne.supabase.co';
const NEW = 'https://supabase.aduticsi.com';
const APPLY = process.argv.includes('--apply');

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .map(l => l.trim()).filter(l => /^[A-Z][A-Z0-9_]*=/.test(l))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!BASE || !KEY) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants');

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

/** @type {{table:string, column:string, isArray?:boolean}[]} */
const TARGETS = [
  { table: 'Member', column: 'photo_url' },
  { table: 'Activity', column: 'image_url' },
  { table: 'Partner', column: 'logo_url' },
  { table: 'Publication', column: 'images', isArray: true },
];

let totalToChange = 0;
let totalChanged = 0;

for (const { table, column, isArray } of TARGETS) {
  const res = await fetch(`${BASE}/rest/v1/${table}?select=id,${column}`, { headers });
  if (!res.ok) {
    console.log(`  ${table}.${column} : ERREUR HTTP ${res.status} — ${await res.text()}`);
    continue;
  }
  const rows = await res.json();

  const todo = [];
  for (const row of rows) {
    const val = row[column];
    if (isArray) {
      if (!Array.isArray(val) || !val.some(v => typeof v === 'string' && v.startsWith(OLD))) continue;
      // Reconstruction index par index : l'ordre du tableau est préservé.
      todo.push({ id: row.id, next: val.map(v => (typeof v === 'string' ? v.replace(OLD, NEW) : v)) });
    } else {
      if (typeof val !== 'string' || !val.startsWith(OLD)) continue;
      todo.push({ id: row.id, next: val.replace(OLD, NEW) });
    }
  }

  totalToChange += todo.length;
  console.log(`\n  ${table}.${column} — ${rows.length} ligne(s) au total, ${todo.length} à réécrire`);

  for (const { id, next } of todo) {
    const preview = isArray ? `${next.length} image(s)` : next.split('/').pop();
    if (!APPLY) {
      console.log(`      [dry-run] ${id} -> ${preview}`);
      continue;
    }
    const patch = await fetch(`${BASE}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ [column]: next }),
    });
    if (patch.ok) {
      totalChanged++;
      console.log(`      [OK]      ${id} -> ${preview}`);
    } else {
      console.log(`      [ECHEC]   ${id} — HTTP ${patch.status} ${await patch.text()}`);
    }
  }
}

console.log(
  APPLY
    ? `\n  ==> ${totalChanged}/${totalToChange} ligne(s) réécrite(s).`
    : `\n  ==> DRY-RUN : ${totalToChange} ligne(s) seraient réécrite(s). Relancer avec --apply.`
);
