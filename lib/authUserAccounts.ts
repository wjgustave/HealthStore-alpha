import authUserAccountsData from '@/content/auth-user-accounts.json'

export type AuthUserAccountRecord = {
  username: string
  /** Base64-encoded bcrypt hash (same format as `AUTH_PASSWORD_HASH` in `.env`). */
  passwordHashB64: string
  displayName: string
  role: string
  organisationName: string
}

const list = authUserAccountsData as AuthUserAccountRecord[]

export function findAuthUserAccount(username: string): AuthUserAccountRecord | null {
  const u = username.trim().toLowerCase()
  if (!u) return null
  return list.find((a) => a.username.toLowerCase() === u) ?? null
}

/** Decode stored hash for bcrypt.compare */
export function resolveAccountPasswordHash(record: AuthUserAccountRecord): string {
  return Buffer.from(record.passwordHashB64, 'base64').toString('utf8')
}
