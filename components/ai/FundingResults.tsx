'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Search, AlertTriangle, UserCheck } from 'lucide-react'
import type { ApplicantFit, FundingResult, MatchType } from '@/lib/ai/funding'

type Props = {
  results: FundingResult[]
  region: string
  selectionLabel: string
  onNewSearch: () => void
  disabled?: boolean
}

const MATCH_TYPE_LABELS: Record<MatchType, string> = {
  dtx_specific: 'DTx-specific',
  condition: 'Condition match',
  condition_area: 'Condition area',
  generic_digital_health: 'Digital health',
}

const APPLICANT_FIT_META: Record<
  ApplicantFit,
  { label: string; bg: string; color: string } | null
> = {
  commissioner_eligible: { label: 'You can apply', bg: '#E8F5EC', color: 'var(--nhs-green)' },
  adoption_partner: { label: 'As adoption partner', bg: '#E8F5EC', color: 'var(--nhs-green)' },
  unclear: { label: 'Eligibility unclear', bg: 'var(--surface)', color: 'var(--text-muted)' },
  // Filtered out before reaching the UI; no badge needed.
  developer_or_academic_only: null,
}

function confidenceBand(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'Strong match', color: 'var(--nhs-green)' }
  if (score >= 50) return { label: 'Moderate match', color: 'var(--nhs-blue)' }
  if (score >= 30) return { label: 'Weak match', color: 'var(--nhs-amber)' }
  return { label: 'Low match', color: 'var(--nhs-red)' }
}

function ResultCard({ result, disabled }: { result: FundingResult; disabled?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const band = confidenceBand(result._score)

  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span
          className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ background: '#E6F0FB', color: 'var(--nhs-blue)' }}
        >
          {MATCH_TYPE_LABELS[result.match_type]}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
          style={{ background: 'var(--surface)', color: 'var(--text-secondary)' }}
        >
          <MapPin className="h-3 w-3" />
          {result.region_scope}
        </span>
        {APPLICANT_FIT_META[result.applicant_fit] && (
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
            style={{
              background: APPLICANT_FIT_META[result.applicant_fit]!.bg,
              color: APPLICANT_FIT_META[result.applicant_fit]!.color,
            }}
          >
            <UserCheck className="h-3 w-3" />
            {APPLICANT_FIT_META[result.applicant_fit]!.label}
          </span>
        )}
      </div>

      <h4
        className="text-base font-bold leading-snug"
        style={{ color: 'var(--text-primary)', fontFamily: 'Frutiger, Arial, sans-serif' }}
      >
        {result.fund_name}
      </h4>
      <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {result.provider}
      </p>

      {/* Confidence bar */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold" style={{ color: band.color }}>
            {result._score}/100 — {band.label}
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full"
          style={{ background: 'var(--surface)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${result._score}%`, background: band.color }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        disabled={disabled}
        className="mt-3 flex items-center gap-1 text-xs font-medium transition-colors hover:underline disabled:opacity-40"
        style={{ color: 'var(--nhs-blue)', fontFamily: 'Frutiger, Arial, sans-serif' }}
      >
        {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {expanded ? 'Hide details' : 'Show details'}
      </button>

      {expanded && (
        <dl className="mt-3 space-y-2 border-t pt-3 text-sm" style={{ borderColor: 'var(--border)' }}>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Eligibility
            </dt>
            <dd style={{ color: 'var(--text-primary)' }}>{result.eligibility_summary || '—'}</dd>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Amount
              </dt>
              <dd style={{ color: 'var(--text-primary)' }}>{result.amount_range ?? 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Deadline
              </dt>
              <dd style={{ color: 'var(--text-primary)' }}>{result.deadline ?? 'Ongoing / unknown'}</dd>
            </div>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Why this matches
            </dt>
            <dd style={{ color: 'var(--text-primary)' }}>{result.match_rationale || '—'}</dd>
          </div>
        </dl>
      )}
    </div>
  )
}

export default function FundingResults({
  results,
  region,
  selectionLabel,
  onNewSearch,
  disabled,
}: Props) {
  const empty = results.length === 0

  return (
    <div className="w-full">
      <div className="mb-3">
        <p
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)', fontFamily: 'Frutiger, Arial, sans-serif' }}
        >
          {empty
            ? 'No funding opportunities found'
            : `${results.length} ${results.length === 1 ? 'opportunity' : 'opportunities'} found`}
          {' · '}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
            {selectionLabel} · {region}
          </span>
        </p>
      </div>

      {empty ? (
        <div
          className="rounded-xl border px-4 py-6 text-center"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No matches were returned. Try the broader condition area, or a different region.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, i) => (
            <ResultCard key={`${r.fund_name}-${i}`} result={r} disabled={disabled} />
          ))}
        </div>
      )}

      <div
        className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
        style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
      >
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--nhs-amber)' }} />
        <span>
          AI-generated results may be incomplete or out of date. Always verify eligibility, amounts,
          and deadlines directly with the funder before relying on them.
        </span>
      </div>

      <button
        type="button"
        onClick={onNewSearch}
        disabled={disabled}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all hover:shadow-sm disabled:opacity-40"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--card)',
          color: 'var(--nhs-blue)',
          fontFamily: 'Frutiger, Arial, sans-serif',
        }}
      >
        <Search className="h-4 w-4" />
        New funding search
      </button>
    </div>
  )
}
