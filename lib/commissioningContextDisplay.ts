import type { SessionData } from '@/lib/session'
import { COMMISSIONING_ENTITIES } from '@/lib/commissioningEntities'

/** Display-only default for primary users with no stored ICB (e.g. commissioner.gordon). */
export const DEFAULT_PRIMARY_ICB_NAME = 'Shropshire, Telford and Wrekin ICB'

/** Shown when multi-user login has not yet selected an ICB. */
export const SELECT_ICB_CONTINUE_MESSAGE = 'Select an ICB to continue'

export function getCommissioningContextLabel(session: SessionData): string {
  if (session.profileOrganisationName) {
    return session.profileOrganisationName
  }
  if (session.commissioningEntityId) {
    const entity = COMMISSIONING_ENTITIES.find((e) => e.id === session.commissioningEntityId)
    if (entity) return entity.name
  }
  if (session.requiresCommissioningEntitySelection) {
    return SELECT_ICB_CONTINUE_MESSAGE
  }
  return DEFAULT_PRIMARY_ICB_NAME
}
