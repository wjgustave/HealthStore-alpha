'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { STORE_ACCENT } from '@/lib/storeAccent'

export default function HomeHeroSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/apps/browse?q=${encodeURIComponent(q)}`)
    } else {
      router.push('/apps/browse')
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[25rem]"
      role="search"
      aria-label="Search apps by name, supplier, or condition"
    >
      <label htmlFor="home-hero-search" className="sr-only">
        Search by app name, supplier, or condition
      </label>
      <div
        className="flex items-stretch overflow-hidden rounded-xl border bg-white/95 shadow-sm backdrop-blur-sm focus-within:ring-2 focus-within:ring-offset-2"
        style={{ borderColor: 'var(--border)', outlineColor: '#005EB8' }}
      >
        <span className="flex items-center pl-4 text-[#425563]" aria-hidden>
          <Search className="h-5 w-5 shrink-0" strokeWidth={2} />
        </span>
        <input
          id="home-hero-search"
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by app, supplier, or condition"
          autoComplete="off"
          className="min-h-[52px] flex-1 border-0 bg-transparent px-3 py-3 text-sm text-[#1A2332] outline-none placeholder:text-[#768692]"
        />
        <button
          type="submit"
          className="shrink-0 px-5 py-3 text-sm font-semibold text-white transition-colors hover:!bg-[#004B8C]"
          style={{ background: STORE_ACCENT }}
        >
          Search
        </button>
      </div>
    </form>
  )
}
