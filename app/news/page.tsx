import Link from 'next/link'
import { getHomeNews } from '@/lib/data'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'
import { formatHomeDate } from '@/components/home/formatDate'

export const metadata = { title: 'News — HealthStore' }

export default function NewsPage() {
  const news = getHomeNews()

  return (
    <div className="hs-page-narrow">
      <PageBreadcrumb items={[{ label: 'News' }]} />
      <div className="hs-section">
        <h1 className="page-title-h1">News</h1>
        <p
          className="m-0 hs-measure leading-relaxed"
          style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
        >
          Curated updates for commissioners: policy, guidance and system context. Placeholder page — more news to follow.
        </p>
      </div>

      <ul className="m-0 flex list-none flex-col gap-6 p-0">
        {news.map((item) => (
          <li
            key={item.id}
            className="hs-surface-card-sm p-6"
          >
            <time className="block hs-text-caption" style={{ color: 'var(--text-muted)' }} dateTime={item.date}>
              {formatHomeDate(item.date)}
            </time>
            <h2 className="mt-1 hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </h2>
            <p className="mt-1 mb-0 hs-text-label leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item.summary}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Link
          href="/"
          className="hs-text-label hs-font-bold text-[var(--nhs-blue)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: 'var(--nhs-blue)' }}
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
