/**
 * Hard-coded reference data for the NHS DTx Funding Finder.
 * Kept deliberately small and explicit per the build spec.
 */

export const REGIONS = [
  'North East and Yorkshire',
  'North West',
  'Midlands',
  'East of England',
  'London',
  'South East',
  'South West',
] as const

export type Region = (typeof REGIONS)[number]

export type ConditionArea = 'Respiratory' | 'CVD'

export type Condition = {
  id: string
  label: string
  area: ConditionArea
}

export const CONDITIONS: Condition[] = [
  { id: 'copd', label: 'COPD', area: 'Respiratory' },
  { id: 'pr', label: 'Pulmonary Rehabilitation', area: 'Respiratory' },
  { id: 'cr', label: 'Cardiac Rehabilitation', area: 'CVD' },
]

export type DtxApp = {
  id: string
  label: string
  condition: string
  area: ConditionArea
}

export const APPS: DtxApp[] = [
  { id: 'mycopd', label: 'myCOPD', condition: 'copd', area: 'Respiratory' },
  { id: 'clinitouch', label: 'Clinitouch', condition: 'copd', area: 'Respiratory' },
  { id: 'copdhub', label: 'COPDhub', condition: 'copd', area: 'Respiratory' },
  { id: 'luscii', label: 'Luscii', condition: 'copd', area: 'Respiratory' },
  { id: 'ayh', label: 'Activate Your Heart', condition: 'cr', area: 'CVD' },
  { id: 'dreachhf', label: 'D REACH-HF', condition: 'cr', area: 'CVD' },
  { id: 'dhm', label: 'Digital Heart Manual', condition: 'cr', area: 'CVD' },
  { id: 'ghb', label: 'Gro Health HeartBuddy', condition: 'cr', area: 'CVD' },
  { id: 'kiactiv', label: 'KiActiv', condition: 'cr', area: 'CVD' },
  { id: 'myheart', label: 'myHeart', condition: 'cr', area: 'CVD' },
  { id: 'pm', label: 'Pumping Marvellous', condition: 'cr', area: 'CVD' },
]

export const SEARCH_MODE = { CONDITION: 'condition', APP: 'app' } as const
export type SearchMode = (typeof SEARCH_MODE)[keyof typeof SEARCH_MODE]

/** Maps a condition id to a descriptive phrase used in the prompt. */
export const CONDITION_MAP: Record<string, string> = {
  copd: 'COPD (chronic obstructive pulmonary disease)',
  pr: 'pulmonary rehabilitation',
  cr: 'cardiac rehabilitation',
}

/** Maps a condition area to a descriptive phrase used in the prompt. */
export const AREA_MAP: Record<ConditionArea, string> = {
  Respiratory: 'respiratory',
  CVD: 'cardiovascular',
}

/**
 * General digital-health synonyms the search should expand against. Broadened
 * (incl. terms carried over from the previous funding finder) to improve recall.
 */
export const DTX_SYNONYMS =
  'digital therapeutics, DTx, digital health, digital health intervention (DHI), health technology, medtech, remote monitoring, remote patient monitoring (RPM), telehealth, telemonitoring, virtual ward, hospital at home, technology-enabled care (TEC), supported self-management app, app-based intervention, NICE-recommended digital health, DTAC-assured technology'

/** Condition-specific synonyms to widen the search per selected condition. */
export const CONDITION_SYNONYMS: Record<string, string> = {
  copd: 'COPD, chronic obstructive pulmonary disease, chronic bronchitis, emphysema, breathlessness, exacerbation management',
  pr: 'pulmonary rehabilitation, PR, respiratory rehabilitation, breathing rehabilitation, exercise-based respiratory programme',
  cr: 'cardiac rehabilitation, cardiac rehab, CR, heart failure management, post-MI rehabilitation, cardiovascular rehabilitation',
}

/** Condition-area synonyms to widen the search at the broad-area level. */
export const AREA_SYNONYMS: Record<ConditionArea, string> = {
  Respiratory: 'respiratory, lung health, long-term respiratory conditions, airways disease',
  CVD: 'cardiovascular, CVD, heart disease, heart failure, cardiac care, circulatory disease',
}

/**
 * Condition-area-specific funder/programme hints to nudge the model towards
 * routes that genuinely exist for that area (improves recall vs. generic asks).
 */
export const AREA_FUNDERS: Record<ConditionArea, string[]> = {
  Respiratory: [
    'NHS @home / virtual wards funding (respiratory / acute respiratory infection)',
    'Health Innovation Network (formerly AHSN) respiratory programmes',
    'Accelerated Access Collaborative (AAC) respiratory and DTx adoption programmes',
    'NHS England respiratory care and pulmonary rehabilitation transformation funds',
    'ICB respiratory long-term conditions and prevention budgets',
  ],
  CVD: [
    'NHS @home / virtual wards funding (heart failure)',
    'Health Innovation Network (formerly AHSN) cardiovascular programmes',
    'Accelerated Access Collaborative (AAC) CVDPREVENT and cardiac adoption programmes',
    'NHS England cardiac rehabilitation and CVD prevention transformation funds',
    'ICB cardiovascular long-term conditions and prevention budgets',
  ],
}

/** Resolve the display label for the current selection. */
export function getSelectionLabel(mode: SearchMode, selection: string): string {
  if (mode === SEARCH_MODE.APP) {
    return APPS.find(a => a.id === selection)?.label ?? selection
  }
  return CONDITIONS.find(c => c.id === selection)?.label ?? selection
}
