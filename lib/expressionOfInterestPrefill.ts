import type { SessionData } from '@/lib/session'

/** Legacy demo defaults when no named account profile is in the session. */
export const LEGACY_EXPRESSION_OF_INTEREST = {
  name: 'Commissioner Gordorn',
  role: 'Commissioiner',
  email: 'henry.gordon90210@nhs.net',
} as const

export type ExpressionOfInterestContactPrefill = {
  name: string
  role: string
  organisation: string
  email: string
}

export function getExpressionOfInterestPrefill(
  session: SessionData,
  commissioningOrganisationLabel: string
): ExpressionOfInterestContactPrefill {
  if (
    session.profileDisplayName &&
    session.profileRole &&
    session.profileOrganisationName &&
    session.profileEmail
  ) {
    return {
      name: session.profileDisplayName,
      role: session.profileRole,
      organisation: session.profileOrganisationName,
      email: session.profileEmail,
    }
  }
  return {
    name: LEGACY_EXPRESSION_OF_INTEREST.name,
    role: LEGACY_EXPRESSION_OF_INTEREST.role,
    organisation: commissioningOrganisationLabel,
    email: LEGACY_EXPRESSION_OF_INTEREST.email,
  }
}
