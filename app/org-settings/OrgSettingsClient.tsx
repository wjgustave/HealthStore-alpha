'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
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
  type EntityType,
  type OrgProfileSettings,
} from '@/lib/orgProfile'
import { Button } from '@/components/ui/Button'
import { FormField, TextInput, Select, Textarea } from '@/components/ui/FormField'
import { useToast } from '@/components/ui/Toast'
import { PageBreadcrumb } from '@/components/PageBreadcrumb'

type ConditionOption = { id: string; label: string }

type Props = {
  initial: OrgProfileSettings
  defaults: OrgProfileSettings
  savedExists: boolean
  dbAvailable: boolean
  conditionOptions: ConditionOption[]
}

const labelStyle = { fontSize: 'var(--text-label)', color: 'var(--text-secondary)' } as const

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
  const toast = useToast()
  const [settings, setSettings] = useState<OrgProfileSettings>(() => clone(initial))
  const [baseline, setBaseline] = useState<OrgProfileSettings>(() => clone(initial))
  const [editing, setEditing] = useState(!savedExists && dbAvailable)
  const [saving, setSaving] = useState(false)

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
    setSettings(prev => ({ ...prev, ...patch }))
  }

  /** Org name change for an ICB-type org also re-infers region. */
  function updateOrganisationName(value: string) {
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
      toast.success('Organisation settings saved for your whole organisation.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setSettings(clone(baseline))
    setEditing(false)
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-8">
      {/* R7 NAV-03: org-settings now has a breadcrumb like every other signed-in page. */}
      <PageBreadcrumb items={[{ label: 'Organisation settings' }]} className="mb-4" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="hs-text-section-alt hs-font-bold" style={{ color: 'var(--nhs-dark)' }}>
            Organisation settings
          </h1>
          <p className="mt-1 hs-text-label" style={{ color: 'var(--text-muted)' }}>
            Shared across everyone in your organisation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled
            title="Coming soon — auto-fill from an AI search"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Find this information
          </Button>
          {editing ? (
            <>
              <Button variant="secondary" size="sm" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} loading={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="h-4 w-4" aria-hidden />
                )}
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setEditing(true)}
              disabled={!dbAvailable}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Button>
          )}
        </div>
      </div>

      {!dbAvailable && (
        <Banner tone="warn">
          Settings storage is currently unavailable, so changes can&apos;t be saved. You can still
          review the current values below.
        </Banner>
      )}
      {dirty && editing && <Banner tone="info">You have unsaved changes.</Banner>}

      {/* Organisation details */}
      <Section title="Organisation details">
        <OrgField
          label="Organisation name"
          hint="The name of your ICB, Trust, CIC or PCN."
          editing={editing}
          readValue={<ReadValue value={settings.organisationName} />}
        >
          {field => (
            <TextInput
              {...field}
              type="text"
              value={settings.organisationName}
              onChange={e => updateOrganisationName(e.target.value)}
              placeholder="e.g. Shropshire, Telford and Wrekin ICB"
            />
          )}
        </OrgField>

        <OrgField label="Entity type" editing={editing} readValue={<ReadValue value={settings.entityType} />}>
          {field => (
            <Select
              {...field}
              value={settings.entityType}
              onChange={e => updateEntityType(e.target.value as EntityType)}
            >
              {ENTITY_TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          )}
        </OrgField>

        {settings.entityType !== 'ICB' && (
          <OrgField
            label="ICB"
            hint="The ICB this organisation sits under."
            editing={editing}
            readValue={<ReadValue value={settings.parentIcbName} />}
          >
            {field => (
              <TextInput
                {...field}
                type="text"
                value={settings.parentIcbName}
                onChange={e => updateParentIcb(e.target.value)}
                placeholder="e.g. West Yorkshire ICB"
              />
            )}
          </OrgField>
        )}

        <OrgField
          label="Region"
          hint="Auto-filled from the ICB. You can override it."
          editing={editing}
          readValue={<ReadValue value={settings.region} />}
        >
          {field => (
            <Select {...field} value={settings.region} onChange={e => update({ region: e.target.value })}>
              <option value="">— Select region —</option>
              {REGIONS.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          )}
        </OrgField>

        <OrgField
          label="Population"
          hint="Size of the population your organisation serves."
          editing={editing}
          readValue={<ReadValue value={settings.population ? settings.population.toLocaleString() : ''} />}
        >
          {field => (
            <TextInput
              {...field}
              type="number"
              min={0}
              inputMode="numeric"
              value={settings.population ?? ''}
              onChange={e => {
                const n = e.target.value === '' ? undefined : Number(e.target.value)
                update({ population: n !== undefined && Number.isFinite(n) && n >= 0 ? n : undefined })
              }}
              placeholder="e.g. 510000"
            />
          )}
        </OrgField>

        <TagField
          label="Local health challenges"
          tags={settings.localHealthChallenges}
          editing={editing}
          placeholder="Add a challenge and press Enter"
          onChange={tags => update({ localHealthChallenges: tags })}
        />

        <TagField
          label="Current digital position"
          tags={settings.currentDigitalPosition}
          editing={editing}
          placeholder="Add a tag and press Enter"
          onChange={tags => update({ currentDigitalPosition: tags })}
        />

        <OrgField
          label="Deprivation profile"
          editing={editing}
          readValue={<ReadValue value={settings.deprivationProfile} multiline />}
        >
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={settings.deprivationProfile}
              onChange={e => update({ deprivationProfile: e.target.value })}
              placeholder="Describe the deprivation profile"
            />
          )}
        </OrgField>

        <OrgField
          label="Rural / urban mix"
          editing={editing}
          readValue={<ReadValue value={settings.ruralUrbanMix} multiline />}
        >
          {field => (
            <Textarea
              {...field}
              rows={3}
              value={settings.ruralUrbanMix}
              onChange={e => update({ ruralUrbanMix: e.target.value })}
              placeholder="Describe the rural / urban mix"
            />
          )}
        </OrgField>
      </Section>

      {/* Priorities */}
      <Section title="Priorities">
        <TagField
          label="General priorities"
          hint="Cross-cutting priorities that are not specific to a single condition."
          tags={settings.strategicPriorities}
          editing={editing}
          placeholder="Add a priority and press Enter"
          onChange={tags => update({ strategicPriorities: tags })}
        />

        <div className="mt-2 space-y-4">
          {settings.conditions.map(condition => (
            <div
              key={condition.conditionId}
              className="rounded-lg border p-4"
              style={{ borderColor: 'var(--border)', background: 'var(--surface, #f7fafc)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="hs-text-label hs-font-bold" style={{ color: 'var(--nhs-dark)' }}>
                  {conditionLabel(condition.conditionId)}
                </h3>
                {editing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCondition(condition.conditionId)}
                    className="gap-1 hover:bg-red-50"
                    style={{ color: '#b91c1c' }}
                    aria-label={`Remove ${conditionLabel(condition.conditionId)}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </Button>
                )}
              </div>

              <div className="mt-4">
                <OrgField
                  label="Cohort"
                  hint={`How many people in your population have ${conditionLabel(condition.conditionId)}?`}
                  editing={editing}
                  readValue={
                    <ReadValue value={condition.cohortSize ? condition.cohortSize.toLocaleString() : ''} />
                  }
                >
                  {field => (
                    <TextInput
                      {...field}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={condition.cohortSize ?? ''}
                      onChange={e => {
                        const n = e.target.value === '' ? undefined : Number(e.target.value)
                        updateCondition(condition.conditionId, {
                          cohortSize: n !== undefined && Number.isFinite(n) && n >= 0 ? n : undefined,
                        })
                      }}
                      placeholder="e.g. 18000"
                    />
                  )}
                </OrgField>
              </div>

              <div className="mt-4">
                <TagField
                  label="Condition priorities"
                  tags={condition.priorities}
                  editing={editing}
                  placeholder="Add a priority and press Enter"
                  onChange={priorities => updateCondition(condition.conditionId, { priorities })}
                />
              </div>
            </div>
          ))}
        </div>

        {editing && <AddCondition options={availableConditions} onAdd={addCondition} />}
        {!editing && settings.conditions.length === 0 && <ReadValue value="" />}
      </Section>
    </div>
  )
}

/* ---------- Presentational helpers ---------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="hs-surface-card mt-6 p-6 sm:p-6">
      <h2 className="hs-text-card-title-sm hs-font-bold" style={{ color: 'var(--nhs-dark)' }}>
        {title}
      </h2>
      <div className="mt-4 space-y-6">{children}</div>
    </section>
  )
}

/**
 * Labelled field that uses the canonical `FormField` (real `<label htmlFor>` +
 * wired `aria-*`) while editing, and a plain label + read value when not.
 */
function OrgField({
  label,
  hint,
  editing,
  children,
  readValue,
}: {
  label: string
  hint?: string
  editing: boolean
  children: Parameters<typeof FormField>[0]['children']
  readValue: ReactNode
}) {
  const id = useId()
  if (editing) {
    return (
      <FormField id={id} label={label} hint={hint}>
        {children}
      </FormField>
    )
  }
  return (
    <div>
      <div className="mb-2">
        <span className="block hs-font-bold" style={labelStyle}>
          {label}
        </span>
        {hint ? (
          <p className="mt-1 hs-text-caption" style={{ color: 'var(--text-muted)' }}>
            {hint}
          </p>
        ) : null}
      </div>
      {readValue}
    </div>
  )
}

function ReadValue({ value, multiline }: { value: string; multiline?: boolean }) {
  if (!value) {
    return (
      <span className="hs-text-label italic" style={{ color: 'var(--text-muted)' }}>
        Not set
      </span>
    )
  }
  return (
    <p
      className={`hs-text-label ${multiline ? 'whitespace-pre-wrap leading-relaxed' : ''}`}
      style={{ color: 'var(--text-secondary)' }}
    >
      {value}
    </p>
  )
}

/** Field group wrapping the tag editor with a proper label. */
function TagField({
  label,
  hint,
  tags,
  editing,
  placeholder,
  onChange,
}: {
  label: string
  hint?: string
  tags: string[]
  editing: boolean
  placeholder?: string
  onChange: (tags: string[]) => void
}) {
  return (
    <div>
      <div className="mb-2">
        <span className="block hs-font-bold" style={labelStyle}>
          {label}
        </span>
        {hint ? (
          <p className="mt-1 hs-text-caption" style={{ color: 'var(--text-muted)' }}>
            {hint}
          </p>
        ) : null}
      </div>
      <TagEditor
        tags={tags}
        editing={editing}
        placeholder={placeholder}
        addLabel={`Add to ${label.toLowerCase()}`}
        onChange={onChange}
      />
    </div>
  )
}

function TagEditor({
  tags,
  editing,
  placeholder,
  addLabel,
  onChange,
}: {
  tags: string[]
  editing: boolean
  placeholder?: string
  addLabel: string
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
        <span className="hs-text-label italic" style={{ color: 'var(--text-muted)' }}>
          Not set
        </span>
      )
    }
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="pill hs-text-caption"
            style={{ background: '#E6F0FB', color: 'var(--nhs-blue)', borderColor: '#E6F0FB' }}
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
              className="pill hs-text-caption"
              style={{ background: '#E6F0FB', color: 'var(--nhs-blue)', borderColor: '#E6F0FB' }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="rounded-full p-1 transition-colors hover:bg-white/60"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <TextInput
          type="text"
          value={draft}
          placeholder={placeholder}
          aria-label={addLabel}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addDraft()
            }
          }}
        />
        <Button
          variant="secondary"
          size="none"
          onClick={addDraft}
          aria-label={addLabel}
          className="max-sm:!w-auto max-sm:!mt-0 max-sm:!mb-0 flex-shrink-0 p-2"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </Button>
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
      <p className="mt-4 hs-text-caption italic" style={{ color: 'var(--text-muted)' }}>
        All available conditions have been added.
      </p>
    )
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <Select
        value={selected}
        aria-label="Add a condition"
        onChange={e => setSelected(e.target.value)}
      >
        <option value="">— Add a condition —</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </Select>
      <Button
        variant="primary"
        size="sm"
        disabled={!selected}
        onClick={() => {
          if (selected) {
            onAdd(selected)
            setSelected('')
          }
        }}
        className="flex-shrink-0 gap-2"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add condition
      </Button>
    </div>
  )
}

function Banner({
  tone,
  children,
}: {
  tone: 'warn' | 'error' | 'success' | 'info'
  children: ReactNode
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
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className="mt-4 flex items-start gap-2 rounded-md border px-4 py-2 hs-text-label"
      style={{ background: palette.bg, borderColor: palette.border, color: palette.color }}
    >
      <Icon className="mt-1 h-4 w-4 flex-shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  )
}
