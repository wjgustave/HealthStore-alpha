/**
 * One-off migration: derive `deployment_register` for apps that don't already have it,
 * from existing `named_sites` / `deployments` / `live_sites`.
 * See docs/PDP_WHERE_ITS_LIVE_REDESIGN.md (section 9, Migration rules).
 *
 * Idempotent: skips any app that already has a non-empty deployment_register.
 * Run: node scripts/migrate-deployment-register.cjs
 */
const fs = require('fs')
const path = require('path')

const APPS_DIR = path.join(__dirname, '..', 'content', 'apps')

function mapNamedStatus(status) {
  if (status === 'decommissioned') return 'historic'
  if (status === 'unknown') return 'unknown'
  return 'live'
}

function rowsFromNamedSites(named) {
  return named
    .filter(s => s && typeof s.name === 'string' && s.name.trim())
    .map(s => ({ site: s.name.trim(), status: mapNamedStatus(s.status) }))
}

function rowsFromDeployments(deployments) {
  return deployments
    .filter(d => d && typeof d.organisation_name === 'string' && d.organisation_name.trim())
    .map(d => {
      const status =
        d.currently_active === false ? 'historic' : d.currently_active === null ? 'unknown' : 'live'
      const noteParts = []
      if (d.deployment_scope) noteParts.push(String(d.deployment_scope))
      if (d.patient_count) noteParts.push(`${Number(d.patient_count).toLocaleString('en-GB')} patients`)
      if (d.country && d.country !== 'United Kingdom') noteParts.push(String(d.country))
      if (d.attribution_flag && d.attribution_note) noteParts.push(String(d.attribution_note))
      const row = { site: d.organisation_name.trim(), status }
      if (d.region) row.location = String(d.region)
      if (noteParts.length) row.notes = noteParts.join(' · ')
      return row
    })
}

function deriveRows(app) {
  const named = Array.isArray(app.named_sites) ? app.named_sites : []
  const fromNamed = rowsFromNamedSites(named)
  if (fromNamed.length) return fromNamed

  const deployments = Array.isArray(app.deployments) ? app.deployments : []
  const fromDeployments = rowsFromDeployments(deployments)
  if (fromDeployments.length) return fromDeployments

  const legacy = typeof app.live_sites === 'string' ? app.live_sites.trim() : ''
  if (legacy) return [{ site: 'Reported deployments', status: 'undocumented', notes: legacy }]

  return []
}

/** Insert `deployment_register` immediately after a preferred anchor key, preserving order. */
function withRegisterInserted(app, rows) {
  const anchorPriority = ['named_sites', 'live_icbs', 'patients_covered_note', 'live_sites']
  const anchor = anchorPriority.find(k => k in app)
  const out = {}
  let inserted = false
  for (const [k, v] of Object.entries(app)) {
    out[k] = v
    if (!inserted && k === anchor) {
      out.deployment_register = rows
      inserted = true
    }
  }
  if (!inserted) out.deployment_register = rows
  return out
}

function main() {
  const files = fs.readdirSync(APPS_DIR).filter(f => f.endsWith('.json'))
  let changed = 0
  for (const file of files) {
    const full = path.join(APPS_DIR, file)
    const app = JSON.parse(fs.readFileSync(full, 'utf8'))
    if (Array.isArray(app.deployment_register) && app.deployment_register.length > 0) {
      console.log(`skip  ${file} (already has deployment_register)`)
      continue
    }
    const rows = deriveRows(app)
    if (rows.length === 0) {
      console.log(`skip  ${file} (no deployment data to migrate)`)
      continue
    }
    const next = withRegisterInserted(app, rows)
    fs.writeFileSync(full, JSON.stringify(next, null, 2) + '\n', 'utf8')
    console.log(`write ${file} (+${rows.length} rows)`)
    changed++
  }
  console.log(`\nDone. Updated ${changed} file(s).`)
}

main()
