import { getAllAppsUnfiltered } from '@/lib/data'
import ExpressInterestHistoryClient from './ExpressInterestHistoryClient'

export const metadata = { title: 'Expressions of interest — HealthStore' }

export default function ExpressInterestPage() {
  const appSlugById: Record<string, string> = {}
  for (const app of getAllAppsUnfiltered()) {
    appSlugById[app.id] = app.slug
  }
  return <ExpressInterestHistoryClient appSlugById={appSlugById} />
}
