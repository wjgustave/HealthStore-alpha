/**
 * Figma Plugin API — creates three wireframe frames matching HealthStore home
 * layouts below the hero (V1 simple, V2 editorial, V3 compact).
 * REST API cannot create nodes; this must run inside Figma.
 */

const NHS_BLUE = { r: 0, g: 0.37, b: 0.47 }
const SLATE_BG = { r: 0.97, g: 0.98, b: 0.99 }
const SLATE_BLOCK = { r: 0.89, g: 0.91, b: 0.94 }
const SLATE_EDITORIAL = { r: 0.93, g: 0.94, b: 0.96 }
const WHITE = { r: 1, g: 1, b: 1 }

const FRAME_W = 1280
const PAD = 32
const GAP_Y = 20
const BETWEEN_FRAMES = 64

async function loadFonts() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
}

function solid(color) {
  return [{ type: 'SOLID', color }]
}

function addLabel(parent, text, x, y, bold) {
  const t = figma.createText()
  t.fontName = { family: 'Inter', style: bold ? 'Bold' : 'Regular' }
  t.characters = text
  t.fontSize = bold ? 13 : 11
  t.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.25, b: 0.32 } }]
  t.x = x
  t.y = y
  parent.appendChild(t)
  return t
}

function addBlock(parent, name, y, h, w, fill, opts) {
  const innerW = w !== undefined ? w : FRAME_W - PAD * 2
  const f = figma.createFrame()
  f.name = name
  f.resize(innerW, h)
  f.x = PAD
  f.y = y
  f.fills = solid(fill)
  f.cornerRadius = opts && opts.radius != null ? opts.radius : 12
  if (opts && opts.accentLeft) {
    const bar = figma.createRectangle()
    bar.resize(4, h)
    bar.x = PAD
    bar.y = y
    bar.fills = solid(NHS_BLUE)
    bar.name = 'accent'
    parent.appendChild(bar)
    f.x = PAD + 8
    f.resize(innerW - 8, h)
  }
  parent.appendChild(f)
  addLabel(parent, name, f.x + 14, y + Math.min(14, h / 2 - 8), false)
  return y + h + GAP_Y
}

function createRootFrame(title, x) {
  const root = figma.createFrame()
  root.name = title
  root.resize(FRAME_W, 3800)
  root.x = x
  root.y = 0
  root.fills = solid(SLATE_BG)
  root.clipsContent = false
  addLabel(root, title, PAD, 16, true)
  return root
}

function stackCommonSections(root, startY) {
  let y = startY
  y = addBlock(root, 'Browse by condition', y, 160, undefined, WHITE, {})
  y = addBlock(root, 'How commissioners use this tool (3 steps)', y, 200, undefined, WHITE, {})
  y = addBlock(root, 'NICE HTE19 / HTG736 callout', y, 140, undefined, { r: 0.9, g: 0.94, b: 0.98 }, {})
  return y
}

function tailSections(root, y) {
  y = addBlock(root, 'Dataset overview (charts)', y, 280, undefined, WHITE, {})
  y = addBlock(root, 'Real-world impact', y, 180, undefined, NHS_BLUE, {})
  y = addBlock(root, 'Funding opportunities', y, 200, undefined, WHITE, {})
  y = addBlock(root, 'Removed / decommissioned apps (table)', y, 160, undefined, WHITE, {})
  addBlock(root, 'Prototype disclaimer', y, 100, undefined, SLATE_BLOCK, { radius: 8 })
}

/** V1 — single column editorial list */
function buildV1(x) {
  const root = createRootFrame('Home below hero — V1 (simple list)', x)
  let y = 48
  y = stackCommonSections(root, y)
  y = addBlock(root, 'Latest news (stacked cards + editorial pills)', y, 360, undefined, SLATE_EDITORIAL, { accentLeft: true })
  y = addBlock(root, 'Clinical evidence (2-col grid)', y, 260, undefined, SLATE_EDITORIAL, { accentLeft: true })
  y = addBlock(root, 'Campaigns (3-col cards)', y, 260, undefined, SLATE_EDITORIAL, { accentLeft: true })
  tailSections(root, y)
  figma.currentPage.appendChild(root)
  return root
}

/** V2 — featured + list; wider campaign cards */
function buildV2(x) {
  const root = createRootFrame('Home below hero — V2 (editorial, default)', x)
  let y = 48
  y = stackCommonSections(root, y)

  const newsH = 420
  const newsTop = y
  const featuredW = Math.floor((FRAME_W - PAD * 2) * 0.36)
  const listW = FRAME_W - PAD * 2 - featuredW - 16

  const nf = figma.createFrame()
  nf.name = 'News: featured + list'
  nf.resize(FRAME_W - PAD * 2, newsH)
  nf.x = PAD
  nf.y = newsTop
  nf.fills = []
  nf.clipsContent = false

  const feat = figma.createFrame()
  feat.name = 'Featured story + image placeholder'
  feat.resize(featuredW, newsH)
  feat.x = 0
  feat.y = 0
  feat.fills = solid(SLATE_EDITORIAL)
  feat.cornerRadius = 12
  const img = figma.createRectangle()
  img.resize(featuredW, Math.floor(newsH * 0.42))
  img.x = 0
  img.y = 0
  img.fills = solid({ r: 0.75, g: 0.82, b: 0.9 })
  img.cornerRadius = 12
  feat.appendChild(img)
  nf.appendChild(feat)

  const lst = figma.createFrame()
  lst.name = 'Further headlines (list)'
  lst.resize(listW, newsH)
  lst.x = featuredW + 16
  lst.y = 0
  lst.fills = []
  for (let i = 0; i < 3; i++) {
    const row = figma.createFrame()
    row.resize(listW, 110)
    row.x = 0
    row.y = i * (110 + 12)
    row.fills = solid(SLATE_EDITORIAL)
    row.cornerRadius = 10
    lst.appendChild(row)
  }
  nf.appendChild(lst)
  root.appendChild(nf)
  y = newsTop + newsH + GAP_Y

  const ev = figma.createFrame()
  ev.name = 'Evidence + campaigns (2-col band)'
  ev.resize(FRAME_W - PAD * 2, 300)
  ev.x = PAD
  ev.y = y
  ev.fills = []
  const half = Math.floor((FRAME_W - PAD * 2 - 16) / 2)
  const e1 = figma.createFrame()
  e1.resize(half, 300)
  e1.fills = solid(SLATE_EDITORIAL)
  e1.cornerRadius = 12
  const e2 = figma.createFrame()
  e2.resize(half, 300)
  e2.x = half + 16
  e2.fills = solid(SLATE_EDITORIAL)
  e2.cornerRadius = 12
  ev.appendChild(e1)
  ev.appendChild(e2)
  root.appendChild(ev)
  y += 300 + GAP_Y

  tailSections(root, y)
  figma.currentPage.appendChild(root)
  return root
}

/** V3 — compact rows / table metaphors */
function buildV3(x) {
  const root = createRootFrame('Home below hero — V3 (compact)', x)
  let y = 48
  y = stackCommonSections(root, y)
  y = addBlock(root, 'Latest news (dense rows + thumbs)', y, 220, undefined, SLATE_EDITORIAL, {})
  y = addBlock(root, 'Clinical evidence (table)', y, 200, undefined, SLATE_EDITORIAL, {})
  y = addBlock(root, 'Campaigns (compact rows + thumbs)', y, 160, undefined, SLATE_EDITORIAL, {})
  tailSections(root, y)
  figma.currentPage.appendChild(root)
  return root
}

async function main() {
  await loadFonts()
  const nodes = []
  nodes.push(buildV1(0))
  nodes.push(buildV2(FRAME_W + BETWEEN_FRAMES))
  nodes.push(buildV3((FRAME_W + BETWEEN_FRAMES) * 2))
  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)
  figma.notify('Created 3 frames: V1, V2 (editorial), V3. Aligns with /?home=v1|v2|v3')
  figma.closePlugin()
}

main().catch((e) => {
  figma.notify('Plugin error: ' + (e && e.message ? e.message : String(e)), { error: true })
  figma.closePlugin()
})
