/**
 * One-time migration: reads .data/bookmarks.json (per-user accountKey)
 * and inserts entries into org_bookmarks (per-org) in Postgres.
 *
 * Maps accountKey (email/username) → user row → organization_id.
 *
 * Run: npx tsx scripts/migrate-bookmarks.ts
 * Requires DATABASE_URL in .env.local or environment.
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, and } from 'drizzle-orm'
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

type OldBookmarkEntry = {
  appId: string
  savedAt: string
}

type OldBookmarkStore = Record<string, OldBookmarkEntry[]>

async function main() {
  const dataFile = path.join(process.cwd(), '.data', 'bookmarks.json')

  if (!fs.existsSync(dataFile)) {
    console.log('No .data/bookmarks.json found — nothing to migrate.')
    return
  }

  const raw = JSON.parse(fs.readFileSync(dataFile, 'utf8')) as OldBookmarkStore
  const accountKeys = Object.keys(raw).filter(k => raw[k].length > 0)

  if (accountKeys.length === 0) {
    console.log('No bookmarks to migrate.')
    return
  }

  console.log(`Found ${accountKeys.length} accounts with bookmarks to migrate.\n`)

  let migrated = 0
  let skipped = 0

  for (const accountKey of accountKeys) {
    const entries = raw[accountKey]

    // Look up user by email (accountKey is typically the email/username)
    const userRows = await db
      .select({ id: schema.users.id, organizationId: schema.users.organizationId })
      .from(schema.users)
      .where(eq(schema.users.email, accountKey))
      .limit(1)

    if (userRows.length === 0) {
      console.log(`  [skip] No DB user for accountKey "${accountKey}" (${entries.length} bookmarks)`)
      skipped += entries.length
      continue
    }

    const { id: userId, organizationId } = userRows[0]

    for (const entry of entries) {
      // Check if already exists
      const existing = await db
        .select({ id: schema.orgBookmarks.id })
        .from(schema.orgBookmarks)
        .where(
          and(
            eq(schema.orgBookmarks.organizationId, organizationId),
            eq(schema.orgBookmarks.appId, entry.appId),
          ),
        )
        .limit(1)

      if (existing.length > 0) {
        console.log(`  [exists] ${entry.appId} in org ${organizationId}`)
        skipped++
        continue
      }

      await db.insert(schema.orgBookmarks).values({
        organizationId,
        appId: entry.appId,
        savedByUserId: userId,
      })
      migrated++
      console.log(`  [migrated] ${entry.appId} → org ${organizationId} (from ${accountKey})`)
    }
  }

  console.log(`\nMigration complete. Migrated: ${migrated}, Skipped: ${skipped}`)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
