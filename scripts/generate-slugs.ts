/**
 * Script manuel : génère les slugs pour les membres existants en base.
 * À lancer UNE SEULE FOIS après la migration.
 *
 * Commande : npx tsx scripts/generate-slugs.ts
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { generateMemberSlug } from '../lib/slug'

// Configuration conforme à Prisma 7 + Supabase (Workflow-CSI)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const members = await prisma.member.findMany({
    where: { slug: null },
    select: { id: true, first_name: true, last_name: true },
  })

  console.log(`🔍 ${members.length} membre(s) sans slug trouvé(s).`)

  for (const member of members) {
    const base = generateMemberSlug(`${member.first_name} ${member.last_name}`)
    let slug = base
    let counter = 2

    // Garantir l'unicité
    while (true) {
      const existing = await prisma.member.findUnique({ where: { slug } })
      if (!existing) break
      slug = `${base}-${counter}`
      counter++
    }

    await prisma.member.update({
      where: { id: member.id },
      data: { slug },
    })

    console.log(`  ✅ ${member.last_name.toUpperCase()} ${member.first_name} → /members/${slug}`)
  }

  console.log('\n✨ Terminé. Tous les membres ont maintenant un slug.')
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
    pool.end()
  })
