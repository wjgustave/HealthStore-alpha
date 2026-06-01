/**
 * Seed script: reads content/auth-user-accounts.json and inserts
 * organizations + users into the Postgres database.
 *
 * Run: npx tsx scripts/seed-db.ts
 * Requires DATABASE_URL in .env.local or environment.
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import * as schema from '../lib/db/schema'
import fs from 'node:fs'
import path from 'node:path'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required. Set it in .env.local or environment.')
  process.exit(1)
}

const sql = neon(DATABASE_URL)
const db = drizzle(sql, { schema })

type AuthAccount = {
  username: string
  displayName: string
  role: string
  organisationName: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

async function main() {
  const accountsPath = path.join(process.cwd(), 'content', 'auth-user-accounts.json')
  const accounts: AuthAccount[] = JSON.parse(fs.readFileSync(accountsPath, 'utf8'))

  // Also seed the primary env user's default org
  const DEFAULT_ORG = 'Shropshire Telford and Wrekin ICB'

  const orgNames = [...new Set([...accounts.map(a => a.organisationName), DEFAULT_ORG])]

  console.log(`Seeding ${orgNames.length} organizations...`)

  const orgMap = new Map<string, string>() // name → id

  for (const name of orgNames) {
    const slug = slugify(name)
    const existing = await db.select().from(schema.organizations).where(eq(schema.organizations.slug, slug))

    if (existing.length > 0) {
      orgMap.set(name, existing[0].id)
      console.log(`  [exists] ${name} (${existing[0].id})`)
    } else {
      const [row] = await db
        .insert(schema.organizations)
        .values({ name, slug })
        .returning({ id: schema.organizations.id })
      orgMap.set(name, row.id)
      console.log(`  [created] ${name} (${row.id})`)
    }
  }

  console.log(`\nSeeding ${accounts.length} users...`)

  for (const account of accounts) {
    const orgId = orgMap.get(account.organisationName)
    if (!orgId) {
      console.error(`  [error] No org found for: ${account.organisationName}`)
      continue
    }

    const email = account.username.trim()
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, email))

    if (existing.length > 0) {
      console.log(`  [exists] ${email}`)
    } else {
      await db.insert(schema.users).values({
        email,
        displayName: account.displayName,
        role: account.role,
        organizationId: orgId,
      })
      console.log(`  [created] ${email} → ${account.organisationName}`)
    }
  }

  console.log('\nSeed complete.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
