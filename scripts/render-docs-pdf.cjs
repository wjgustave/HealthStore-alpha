/**
 * Markdown → PDF with Mermaid diagrams rendered to SVG (via mermaid.js in headless Chrome).
 * Requires Chrome/Chromium; set PUPPETEER_EXECUTABLE_PATH if auto-detect fails.
 *
 * Usage:
 *   node scripts/render-docs-pdf.cjs
 *   node scripts/render-docs-pdf.cjs --only docs/USER_FLOWS.md
 */

const fs = require('fs')
const path = require('path')
const { marked } = require('marked')
const puppeteer = require('puppeteer-core')

const MERMAID_CDN =
  'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js'

const ROOT = path.join(__dirname, '..')
const DOCS = path.join(ROOT, 'docs')

function findChromeExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH
  }
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ]
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p
    } catch {
      /* ignore */
    }
  }
  return null
}

/** Split markdown into alternating md / mermaid segments. */
function splitMermaid(md) {
  const parts = []
  const re = /```mermaid\n([\s\S]*?)```/g
  let last = 0
  let m
  while ((m = re.exec(md)) !== null) {
    if (m.index > last) {
      parts.push({ type: 'md', text: md.slice(last, m.index) })
    }
    parts.push({ type: 'mermaid', text: m[1].trim() })
    last = m.index + m[0].length
  }
  if (last < md.length) {
    parts.push({ type: 'md', text: md.slice(last) })
  }
  if (parts.length === 0) {
    parts.push({ type: 'md', text: md })
  }
  return parts
}

function partsToBodyHtml(parts) {
  return parts
    .map((p) => {
      if (p.type === 'html') {
        return p.text
      }
      if (p.type === 'md') {
        return marked.parse(p.text)
      }
      return `<div class="mermaid-wrap"><div class="mermaid">${p.text}</div></div>`
    })
    .join('\n')
}

function wrapHtmlDocument(title, bodyInner) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <script src="${MERMAID_CDN}"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 11pt; line-height: 1.45; color: #222; margin: 0; padding: 12mm 14mm;
    }
    h1 { font-size: 1.55rem; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; page-break-after: avoid; }
    h2 { font-size: 1.12rem; margin-top: 1.25rem; page-break-after: avoid; }
    h3 { font-size: 1rem; margin-top: 0.9rem; page-break-after: avoid; }
    table { border-collapse: collapse; width: 100%; margin: 0.65rem 0; font-size: 8.8pt; }
    th, td { border: 1px solid #bbb; padding: 5px 6px; vertical-align: top; text-align: left; }
    th { background: #f5f5f5; }
    code { background: #f4f4f4; padding: 1px 3px; font-size: 0.88em; }
    pre { background: #f4f4f4; padding: 8px; overflow-x: auto; font-size: 8.5pt; white-space: pre-wrap; }
    a { color: #06c; word-break: break-word; }
    hr { border: none; border-top: 1px solid #ddd; margin: 1.25rem 0; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    .page-break { page-break-before: always; }
    .mermaid-wrap { margin: 1rem 0; text-align: center; page-break-inside: avoid; }
    .mermaid-wrap svg { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${bodyInner}
</body>
</html>`
}

async function renderPartsToPdf(parts, pdfPath, displayTitle) {
  const body = partsToBodyHtml(parts)
  const html = wrapHtmlDocument(displayTitle, body)
  const mermaidBlocks = parts.filter((p) => p.type === 'mermaid').length

  const executablePath = findChromeExecutable()
  if (!executablePath) {
    throw new Error(
      'Chrome/Chromium not found. Set PUPPETEER_EXECUTABLE_PATH to your browser executable.',
    )
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  try {
    const page = await browser.newPage()
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 120000,
    })

    if (mermaidBlocks > 0) {
      await page.evaluate(async () => {
        const m = globalThis.mermaid
        if (!m) throw new Error('mermaid not loaded from CDN')
        m.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'loose',
          flowchart: { useMaxWidth: true, htmlLabels: true },
        })
        await m.run({ suppressErrors: true })
      })
      await page.waitForFunction(
        (n) => {
          if (n === 0) return true
          const blocks = document.querySelectorAll('.mermaid-wrap')
          if (blocks.length === 0) return false
          return [...blocks].every((el) => el.querySelector('svg'))
        },
        { timeout: 90000 },
        mermaidBlocks,
      )
    }

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
    })
  } finally {
    await browser.close()
  }
}

async function mdFileToPdf(mdPath, pdfPath, displayTitle) {
  const md = fs.readFileSync(mdPath, 'utf8')
  await renderPartsToPdf(splitMermaid(md), pdfPath, displayTitle)
}

function combinedJourneyAndFlowsParts(journeyMd, flowsMd) {
  return [
    ...splitMermaid(journeyMd),
    { type: 'html', text: '<div class="page-break"></div>' },
    ...splitMermaid(flowsMd),
  ]
}

async function main() {
  const args = process.argv.slice(2)
  const onlyIdx = args.indexOf('--only')
  const chrome = findChromeExecutable()
  if (!chrome) {
    console.error(
      'No Chrome/Chromium found. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH.',
    )
    process.exit(1)
  }

  if (onlyIdx !== -1 && args[onlyIdx + 1]) {
    const rel = args[onlyIdx + 1]
    const mdPath = path.isAbsolute(rel) ? rel : path.join(ROOT, rel)
    const base = path.basename(mdPath, '.md')
    const pdfPath = path.join(path.dirname(mdPath), `${base}.pdf`)
    console.log('Rendering', mdPath, '→', pdfPath)
    await mdFileToPdf(mdPath, pdfPath, base)
    console.log('Done.')
    return
  }

  const defaultJobs = [
    {
      mdPath: path.join(DOCS, 'BA_REQUIREMENTS_BASELINE.md'),
      pdfPath: path.join(DOCS, 'BA_REQUIREMENTS_BASELINE.pdf'),
      title: 'BA Requirements Baseline',
    },
    {
      mdPath: path.join(DOCS, 'USER_JOURNEY_MAPS.md'),
      pdfPath: path.join(DOCS, 'USER_JOURNEY_MAPS.pdf'),
      title: 'User journey maps',
    },
    {
      mdPath: path.join(DOCS, 'USER_FLOWS.md'),
      pdfPath: path.join(DOCS, 'USER_FLOWS.pdf'),
      title: 'User flows',
    },
  ]

  for (const job of defaultJobs) {
    if (!fs.existsSync(job.mdPath)) {
      console.error('Missing:', job.mdPath)
      process.exit(1)
    }
    console.log('Rendering', job.mdPath, '→', job.pdfPath)
    await mdFileToPdf(job.mdPath, job.pdfPath, job.title)
  }

  const journeyPath = path.join(DOCS, 'USER_JOURNEY_MAPS.md')
  const flowsPath = path.join(DOCS, 'USER_FLOWS.md')
  const handoffPdf = path.join(DOCS, 'UX_HANDOFF.pdf')
  if (fs.existsSync(journeyPath) && fs.existsSync(flowsPath)) {
    const journey = fs.readFileSync(journeyPath, 'utf8')
    const flows = fs.readFileSync(flowsPath, 'utf8')
    const parts = combinedJourneyAndFlowsParts(journey, flows)
    console.log('Rendering UX handoff →', handoffPdf)
    await renderPartsToPdf(
      parts,
      handoffPdf,
      'UX handoff — Journeys and user flows',
    )
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
