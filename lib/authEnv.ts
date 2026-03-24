/**
 * Reads bcrypt hash from env. Supports:
 * - Plain bcrypt string (starts with `$2a$` / `$2b$` / `$2y$`) — must be quoted in .env if using `$` expansion
 * - Base64-encoded bcrypt (recommended for .env files — no `$` issues)
 */
export function resolveBcryptHashFromEnv(raw: string | undefined): string {
  if (!raw) return ''
  const t = raw.trim()
  if (t.startsWith('$2')) return t
  try {
    const decoded = Buffer.from(t, 'base64').toString('utf8')
    if (decoded.startsWith('$2')) return decoded
  } catch {
    /* ignore */
  }
  return t
}
