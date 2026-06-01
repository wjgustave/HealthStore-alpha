/**
 * Run SQL migration files against the database.
 *
 * Run: npx tsx scripts/run-migration.ts
 * Requires DATABASE_URL in .env.local or environment.
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'
import path from 'node:path'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required. Set it in .env.local or environment.')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

function splitSqlStatements(content: string): string[] {
  // Good enough for simple migration files (CREATE TABLE/INDEX etc.)
  return content
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
}

async function main() {
  const migrationsDir = path.join(process.cwd(), 'drizzle')
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const filePath = path.join(migrationsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const statements = splitSqlStatements(content)

    console.log(`Running migration: ${file} (${statements.length} statements)`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      try {
        await sql.query(statement)
      } catch (err) {
        console.error(`\nFailed at statement ${i + 1}/${statements.length} in ${file}`)
        console.error('Statement:')
        console.error(statement)
        throw err
      }
    }

    console.log('  Done.')
  }

  console.log('\nAll migrations complete.')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})