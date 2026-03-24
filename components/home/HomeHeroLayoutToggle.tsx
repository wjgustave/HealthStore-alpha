'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { parseHomeVariant, type HomeLayoutVariant } from '@/lib/homeVariant'

function linkClass(active: boolean, surface: 'hero' | 'header') {
  if (surface === 'header') {
    return [
      'rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005EB8]',
      active ? 'font-semibold text-[#005EB8]' : 'text-[#425563]/45 hover:text-[#425563]/70',
    ].join(' ')
  }
  return [
    'rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80',
    active ? 'text-white' : 'text-white/45 hover:text-white/65',
  ].join(' ')
}

export default function HomeHeroLayoutToggle({ surface = 'header' }: { surface?: 'hero' | 'header' }) {
  const searchParams = useSearchParams()
  const variant = parseHomeVariant(searchParams.get('home') ?? undefined)

  return (
    <div
      role="group"
      aria-label="Homepage layout version"
      className="flex shrink-0 items-center gap-0.5 sm:gap-1"
    >
      {(['v1', 'v2'] as const).map((v: HomeLayoutVariant) => (
        <Link key={v} href={`/?home=${v}`} className={linkClass(variant === v, surface)} scroll={false}>
          {v === 'v1' ? 'V1' : 'V2'}
        </Link>
      ))}
    </div>
  )
}
