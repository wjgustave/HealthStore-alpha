import type { App } from '@/lib/data'
import type { HomeLayoutV4Props } from '@/components/home/concept/ConceptColumns'

export type DashboardVariantProps = Omit<HomeLayoutV4Props, 'apps'> & {
  apps: App[]
  displayName?: string
  organisationName?: string
}
