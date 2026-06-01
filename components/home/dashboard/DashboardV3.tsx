import Link from 'next/link'
import { Search, GitCompare, Banknote, ChevronRight } from 'lucide-react'
import { NewsListConcept } from '@/components/home/HomeLayoutV4'
import { DashboardWelcome } from './DashboardWelcome'
import { SavedAppsWidget } from './widgets/SavedAppsWidget'
import { CommissionedAppsWidget } from './widgets/CommissionedAppsWidget'
import { EoiActivityWidget } from './widgets/EoiActivityWidget'
import type { DashboardVariantProps } from './types'

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

const QUICK_LINKS = [
  { href: '/apps', label: 'Find apps', icon: Search },
  { href: '/compare', label: 'Comparison tool', icon: GitCompare },
  { href: '/funding', label: 'Funding directory', icon: Banknote },
]

function QuickLinksCard() {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-md" style={{ borderColor: 'var(--border)' }}>
      <h3 className="mb-4 text-lg font-bold" style={{ ...fr, color: 'var(--text-primary)' }}>
        Quick links
      </h3>
      <ul className="m-0 list-none space-y-2 p-0">
        {QUICK_LINKS.map(l => {
          const Icon = l.icon
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
                style={{ borderColor: 'var(--border)', color: '#005EB8' }}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />
                  {l.label}
                </span>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Version 3 - "Activity-focused": audit trail + commissioned in the main column, saved + quick links in the sidebar. */
export function DashboardV3(props: DashboardVariantProps) {
  const { apps, news, conceptGrid, displayName, organisationName } = props

  return (
    <div className="flex flex-col gap-12 md:gap-14">
      <DashboardWelcome displayName={displayName} organisationName={organisationName} />

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <EoiActivityWidget limit={6} />
          <CommissionedAppsWidget commissioned={conceptGrid.commissioned} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-1">
          <SavedAppsWidget apps={apps} />
          <QuickLinksCard />
        </div>
      </div>

      <NewsListConcept news={news} />
    </div>
  )
}
