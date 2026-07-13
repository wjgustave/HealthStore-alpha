import { getAllApps } from '@/lib/data'
import SavedAppsClient from './SavedAppsClient'

export const metadata = { title: 'Saved apps — NHS HealthStore' }

export default function SavedAppsPage() {
  const allApps = getAllApps()
  return <SavedAppsClient allApps={allApps} />
}
