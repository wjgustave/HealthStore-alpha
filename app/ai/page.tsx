import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import { getCommissionerProfile } from '@/lib/ai/commissionerProfiles'
import AiChatClient from './AiChatClient'

export const metadata: Metadata = {
  title: 'AI Advisor — HealthStore',
  description: 'AI-powered commissioning advisor for digital health technology procurement',
}

export default async function AiPage() {
  const session = await getSession()
  const profile = getCommissionerProfile(session.commissioningEntityId)

  const clientProfile = {
    commissionerName: profile.commissionerName,
    roleTitle: profile.roleTitle,
    icbName: profile.icbName,
    region: profile.region,
    starterPrompts: profile.starterPrompts,
  }

  return <AiChatClient profile={clientProfile} />
}
