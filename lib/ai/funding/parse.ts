/**
 * Robustly pull a funding array out of model text. Survives: code fences,
 * preamble/postamble prose, citation artifacts, and a truncated (cut-off) array.
 *
 * Strategy:
 *  1. Strip code fences, then try to parse a complete array, scanning back from
 *     the last `]` so trailing prose doesn't break it.
 *  2. Truncation fallback: walk the text with a string-aware balanced-brace
 *     scanner and collect every complete top-level `{...}` object.
 *  3. On total failure, throw with the first ~160 chars of the response.
 */
export function extractFundingArray(text: string): Record<string, unknown>[] {
  const t = text.replace(/```json/gi, '').replace(/```/g, '')

  // 1) Best case: a complete, valid array somewhere in the text.
  const start = t.indexOf('[')
  if (start !== -1) {
    for (let end = t.lastIndexOf(']'); end > start; end = t.lastIndexOf(']', end - 1)) {
      try {
        const candidate = JSON.parse(t.slice(start, end + 1))
        if (Array.isArray(candidate)) return candidate as Record<string, unknown>[]
      } catch {
        /* keep trying shorter slices */
      }
    }
  }

  // 2) Truncation fallback: collect complete top-level {...} objects.
  const objects: Record<string, unknown>[] = []
  let depth = 0
  let objStart = -1
  let inStr = false
  let esc = false
  for (let i = 0; i < t.length; i++) {
    const ch = t[i]
    if (inStr) {
      if (esc) esc = false
      else if (ch === '\\') esc = true
      else if (ch === '"') inStr = false
      continue
    }
    if (ch === '"') {
      inStr = true
      continue
    }
    if (ch === '{') {
      if (depth === 0) objStart = i
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0 && objStart !== -1) {
        try {
          const obj = JSON.parse(t.slice(objStart, i + 1))
          if (obj && typeof obj === 'object') objects.push(obj as Record<string, unknown>)
        } catch {
          /* skip malformed object */
        }
        objStart = -1
      }
    }
  }
  if (objects.length) return objects

  // 3) Nothing usable.
  throw new Error('No JSON array found. Response began: ' + t.trim().slice(0, 160))
}
