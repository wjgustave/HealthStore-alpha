/**
 * Storytelling component layer — the NHS-faithful "gap" components inferred where
 * NHS frontend ships no equivalent (KPI tiles, pathway visuals, impact bars,
 * numbered steps, chart panels, segmented toggle, removable pills, product hero
 * media). All render the `hs-*` classes defined in app/globals.css, built on NHS
 * tokens (flat surfaces, 4px corners, NHS colour/type/spacing).
 */
export { KpiTile } from './KpiTile'
export { ImpactBar } from './ImpactBar'
export { ProcessSteps, type ProcessStep } from './ProcessSteps'
export { PathwayVisual, type PathwayStep } from './PathwayVisual'
export { ChartPanel, type ChartLegendItem } from './ChartPanel'
export { SegmentedToggle, type SegmentedOption } from './SegmentedToggle'
export { RemovablePill } from './RemovablePill'
export { ProductHeroMedia, ProductHeroVideo, ProductHeroDemoCard } from './ProductHeroMedia'
