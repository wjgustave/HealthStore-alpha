import { getAllAppsUnfiltered } from '@/lib/data'
import EoiRecordClient from './EoiRecordClient'

export const metadata = { title: 'EOI record — NHS HealthStore' }

export default function EoiRecordPage() {
  const appSlugById: Record<string, string> = {}
  for (const app of getAllAppsUnfiltered()) {
    appSlugById[app.id] = app.slug
  }
  return <EoiRecordClient appSlugById={appSlugById} />
}
