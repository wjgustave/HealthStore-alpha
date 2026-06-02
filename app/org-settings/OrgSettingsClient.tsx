'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { REGIONS, inferRegionFromOrganisationName } from '@/lib/regionInference'
import {
  ENTITY_TYPES,
  emptyOrgProfileSettings,
  type EntityType,
  type OrgProfileSettings,
} from '@/lib/orgProfile'

type ConditionOption = { id: string; label: string }

type Props = {
  initial: OrgProfileSettings
  defaults: OrgProfileSettings
  savedExists: boolean
  dbAvailable: boolean
  conditionOptions: ConditionOption[]
}

function clone(s: OrgProfileSettings): OrgProfileSettings {
  return {
    ...s,
    localHealthChallenges: [...s.localHealthChallenges],
    currentDigitalPosition: [...s.currentDigitalPosition],
    strategicPriorities: [...s.strategicPriorities],
    conditions: s.conditions.map(c => ({ ...c, priorities: [...c.priorities] })),
  }
}

export default function OrgSettingsClient({
  initial,
  savedExists,
  dbAvailable,
  conditionOptions,
}: Props) {
  const [settings, setSettings] = useState<OrgProfileSettings>(() => clone(initial))
  const [baseline, setBaseline] = useState<OrgProfileSettings>(() => clone(initial))
  const [editing, setEditing] = useState(!savedExists && dbAvailable)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedOk, setSavedOk] = useState(false)

  const dirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(baseline),
    [settings, baseline],
  )
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty

  const conditionLabel = useCallback(
    (id: string) => conditionOptions.find(c => c.id === id)?.label ?? id,
    [conditionOptions],
  )

  const availableConditions = useMemo(
    () => conditionOptions.filter(c => !settings.conditions.some(sc => sc.conditionId === c.id)),
    [conditionOptions, settings.conditions],
  )

  // Warn on browser navigation / reload while there are unsaved edits.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirtyRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  // Intercept in-app link navigation while dirty (App Router has no route-change guard).
  useEffect(() => {
    function onClickCapture(e: MouseEvent) {
      if (!dirtyRef.current) return
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const anchor = (e.target as HTMLElement | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('#') || anchor.target === '_blank') return
      const dest = new URL(anchor.href, window.location.href)
      if (dest.pathname === window.location.pathname) return
      const ok = window.confirm('You have unsaved changes. Leave this page and discard them?')
      if (!ok) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('click', onClickCapture, true)
    return () => document.removeEventListener('click', onClickCapture, true)
  }, [])

  function update(patch: Partial<OrgProfileSettings>) {
    setSavedOk(false)
    setSettings(prev => ({ ...prev, ...patch }))
  }

  /** Org name change for an ICB-type org also re-infers region. */
  function updateOrganisationName(value: string) {
    setSavedOk(false)
    setSettings(prev => {
      const next = { ...prev, organisationName: value }
      if (prev.entityType === 'ICB') {
        const region = inferRegionFromOrganisationName(value)
        if (region) next.region = region
      }
      return next
    })
  }

  function updateParentIcb(value: string) {
    setSavedOk(false)
    setSettings(prev => {
      const next = { ...prev, parentIcbName: value }
      if (prev.entityType !== 'ICB') {
        const region = inferRegionFromOrganisationName(value)
        if (region) next.region = region
      }
      return next
    })
  }

  function updateEntityType(value: EntityType) {
    setSavedOk(false)
    setSettings(prev => {
      const next = { ...prev, entityType: value }
      const icbName = value === 'ICB' ? prev.organisationName : prev.parentIcbName
      const region = inferRegionFromOrganisationName(icbName)
      if (region) next.region = region
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSavedOk(false)
    try {
      const res = await fetch('/api/org-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error ?? 'Could not save settings.')
      }
      const saved: OrgProfileSettings = data.profile ?? settings
      setSettings(clone(saved))
      setBaseline(clone(saved))
      setEditing(false)
      setSavedOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setSettings(clone(baseline))
    setEditing(false)
    setError(null)
    setSavedOk(false)
  }

  function addCondition(conditionId: string) {
    if (!conditionId) return
    if (settings.conditions.some(c => c.conditionId === conditionId)) return
    update({ conditions: [...settings.conditions, { conditionId, priorities: [] }] })
  }

  function removeCondition(conditionId: string) {
    update({ conditions: settings.conditions.filter(c => c.conditionId !== conditionId) })
  }

  function updateCondition(conditionId: string, patch: Partial<OrgProfileSettings['conditions'][number]>) {
    update({
      conditions: settings.conditions.map(c =>
        c.conditionId === conditionId ? { ...c, ...patch } : c,
      ),
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--nhs-dark)' }}>
            Organisation settings
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Shared across everyone in your organisation. Used to personalise the AI Advisor.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Coming soon — auto-fill from an AI search"
            className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium opacity-60"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <Sparkles className="h-4 w-4" />
            Find this information
          </button>
          {editing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: 'var(--nhs-blue)' }}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={!dbAvailable}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ background: 'var(--nhs-blue)' }}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {!dbAvailable && (
        <Banner tone="warn">
          Settings storage is currently unavailable, so changes can&apos;t be saved. You can still
          review the current values below.
        </Banner>
      )}
      {error && <Banner tone="error">{error}</Banner>}
      {savedOk && (
        <Banner tone="success">Organisation settings saved for your whole organisation.</Banner>
      )}
      {dirty && editing && (
        <Banner tone="info">You have unsaved changes.</Banner>
      )}

      {/* Organisation details */}
      <Section title="Organisation details">
        <Field label="Organisation name" hint="The name of your ICB, Trust, CIC or PCN.">
          {editing ? (
            <TextInput
              value={settings.organisationName}
              onChange={updateOrganisationName}
              placeholder="e.g. Shropshire, Telford and Wrekin ICB"
            />
          ) : (
            <ReadValue value={settings.organisationName} />
          )}
        </Field>

        <Field label="Entity type">
          {editing ? (
            <Select
              value={settings.entityType}
              onChange={v => updateEntityType(v as EntityType)}
              options={ENTITY_TYPES.map(t => ({ value: t, label: t }))}
            />
          ) : (
            <ReadValue value={settings.entityType} />
          )}
        </Field>

        {settings.entityType !== 'ICB' && (
          <Field label="ICB" hint="The ICB this organisation sits under.">
            {editing ? (
              <TextInput
                value={settings.parentIcbName}
                onChange={updateParentIcb}
                placeholder="e.g. West Yorkshire ICB"
              />
            ) : (
              <ReadValue value={settings.parentIcbName} />
            )}
          </Field>
        )}

        <Field label="Region" hint="Auto-filled from the ICB. You can override it.">
          {editing ? (
            <Select
              value={settings.region}
              onChange={v => update({ region: v })}
              options={[{ value: '', label: '— Select region —' }, ...REGIONS.map(r => ({ value: r, label: r }))]}
            />
          ) : (
            <ReadValue value={settings.region} />
          )}
        </Field>

        <Field label="Population" hint="Size of the population your organisation serves.">
          {editing ? (
            <NumberInput
              value={settings.population}
              onChange={v => update({ population: v })}
              placeholder="e.g. 510000"
            />
          ) : (
            <ReadValue value={settings.population ? settings.population.toLocaleString() : ''} />
          )}
        </Field>

        <Field label="Local health challenges">
          <TagEditor
            tags={settings.localHealthChallenges}
            editing={editing}
            placeholder="Add a challenge and press Enter"
            onChange={tags => update({ localHealthChallenges: tags })}
          />
        </Field>

        <Field label="Current digital position">
          <TagEditor
            tags={settings.currentDigitalPosition}
            editing={editing}
            placeholder="Add a tag and press Enter"
            onChange={tags => update({ currentDigitalPosition: tags })}
          />
        </Field>

        <Field label="Deprivation profile">
          {editing ? (
            <TextArea
              value={settings.deprivationProfile}
              onChange={v => update({ deprivationProfile: v })}
              placeholder="Describe the deprivation profile"
            />
          ) : (
            <ReadValue value={settings.deprivationProfile} multiline />
          )}
        </Field>

        <Field label="Rural / urban mix">
          {editing ? (
            <TextArea
              value={settings.ruralUrbanMix}
              onChange={v => update({ ruralUrbanMix: v })}
              placeholder="Describe the rural / urban mix"
            />
          ) : (
            <ReadValue value={settings.ruralUrbanMix} multiline />
          )}
        </Field>
      </Section>

      {/* Priorities */}
      <Section title="Priorities">
        <Field
          label="General priorities"
          hint="Cross-cutting priorities that are not specific to a single condition."
        >
          <TagEditor
            tags={settings.strategicPriorities}
            editing={editing}
            placeholder="Add a priority and press Enter"
            onChange={tags => update({ strategicPriorities: tags })}
          />
        </Field>

        <div className="mt-2 space-y-4">
          {settings.conditions.map(condition => (
            <div
              key={condition.conditionId}
              className="rounded-lg border p-4"
              style={{ borderColor: 'var(--border)', background: 'var(--surface, #f7fafc)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--nhs-dark)' }}>
                  {conditionLabel(condition.conditionId)}
                </h3>
                {editing && (
                  <button
                    type="button"
                    onClick={() => removeCondition(condition.conditionId)}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-red-50"
                    style={{ color: '#b91c1c' }}
                    aria-label={`Remove ${conditionLabel(condition.conditionId)}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-3">
                <FieldLabel
                  label="Cohort"
                  hint={`How many people in your population have ${conditionLabel(condition.conditionId)}?`}
                />
                {editing ? (
                  <NumberInput
                    value={condition.cohortSize}
                    onChange={v => updateCondition(condition.conditionId, { cohortSize: v })}
                    placeholder="e.g. 18000"
                  />
                ) : (
                  <ReadValue
                    value={condition.cohortSize ? condition.cohortSize.toLocaleString() : ''}
                  />
                )}
              </div>

              <div className="mt-3">
                <FieldLabel label="Condition priorities" />
                <TagEditor
                  tags={condition.priorities}
                  editing={editing}
                  placeholder="Add a priority and press Enter"
                  onChange={priorities => updateCondition(condition.conditionId, { priorities })}
                />
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <AddCondition options={availableConditions} onAdd={addCondition} />
        )}
        {!editing && settings.conditions.length === 0 && (
          <ReadValue value="" />
        )}
      </Section>
    </div>
  )
}

/* ---------- Presentational helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="mt-6 rounded-xl border bg-white p-5 sm:p-6"
      style={{ borderColor: 'var(--border)' }}
    >
      <h2 className="text-lg font-semibold" style={{ color: 'var(--nhs-dark)' }}>
        {title}
      </h2>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  )
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-sm font-medium" style={{ color: 'var(--nhs-dark)' }}>
        {label}
      </span>
      {hint && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      {children}
    </div>
  )
}

function ReadValue({ value, multiline }: { value: string; multiline?: boolean }) {
  if (!value) {
    return (
      <span className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
        Not set
      </span>
    )
  }
  return (
    <p
      className={`text-sm ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}
      style={{ color: 'var(--text-secondary)' }}
    >
      {value}
    </p>
  )
}

const inputClass =
  'w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--nhs-blue)]'
const inputStyle = { borderColor: 'var(--border)', color: 'var(--nhs-dark)' } as const

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={inputClass}
      style={inputStyle}
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={3}
      onChange={e => onChange(e.target.value)}
      className={inputClass}
      style={inputStyle}
    />
  )
}

function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | undefined
  onChange: (v: number | undefined) => void
  placeholder?: string
}) {
  return (
    <input
      type="number"
      min={0}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={e => {
        const n = e.target.value === '' ? undefined : Number(e.target.value)
        onChange(n !== undefined && Number.isFinite(n) && n >= 0 ? n : undefined)
      }}
      className={inputClass}
      style={inputStyle}
    />
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={inputClass}
      style={inputStyle}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function TagEditor({
  tags,
  editing,
  placeholder,
  onChange,
}: {
  tags: string[]
  editing: boolean
  placeholder?: string
  onChange: (tags: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function addDraft() {
    const v = draft.trim()
    if (!v) return
    if (!tags.includes(v)) onChange([...tags, v])
    setDraft('')
  }

  function removeAt(index: number) {
    onChange(tags.filter((_, i) => i !== index))
  }

  if (!editing) {
    if (tags.length === 0) {
      return (
        <span className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
          Not set
        </span>
      )
    }
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: '#E6F0FB', color: 'var(--nhs-blue)' }}
          >
            {tag}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: '#E6F0FB', color: 'var(--nhs-blue)' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="rounded-full p-0.5 transition-colors hover:bg-white/60"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addDraft()
            }
          }}
          className={inputClass}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={addDraft}
          className="inline-flex flex-shrink-0 items-center justify-center rounded-md border p-2 transition-colors hover:bg-gray-50"
          style={{ borderColor: 'var(--border)', color: 'var(--nhs-blue)' }}
          aria-label="Add"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function AddCondition({
  options,
  onAdd,
}: {
  options: ConditionOption[]
  onAdd: (id: string) => void
}) {
  const [selected, setSelected] = useState('')

  if (options.length === 0) {
    return (
      <p className="mt-3 text-xs italic" style={{ color: 'var(--text-muted)' }}>
        All available conditions have been added.
      </p>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className={inputClass}
        style={inputStyle}
      >
        <option value="">— Add a condition —</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          if (selected) {
            onAdd(selected)
            setSelected('')
          }
        }}
        disabled={!selected}
        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50"
        style={{ background: 'var(--nhs-blue)' }}
      >
        <Plus className="h-4 w-4" />
        Add condition
      </button>
    </div>
  )
}

function Banner({
  tone,
  children,
}: {
  tone: 'warn' | 'error' | 'success' | 'info'
  children: React.ReactNode
}) {
  const palette = {
    warn: { bg: '#FFF8E1', border: '#F2C94C', color: '#8a6d00', Icon: AlertTriangle },
    error: { bg: '#FDECEA', border: '#F5C6CB', color: '#b91c1c', Icon: AlertTriangle },
    success: { bg: '#E8F5EC', border: '#9FD8B0', color: '#1b7a3d', Icon: CheckCircle2 },
    info: { bg: '#E6F0FB', border: '#A9CBEF', color: '#0b4ea2', Icon: AlertTriangle },
  }[tone]
  const Icon = palette.Icon
  return (
    <div
      className="mt-4 flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
      style={{ background: palette.bg, borderColor: palette.border, color: palette.color }}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  )
}
