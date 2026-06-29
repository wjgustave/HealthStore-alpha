import { describe, it, expect } from 'vitest'
import { buildCoverageFunnelStages, getWorkspaceIcbData } from '@/lib/localData/workspaceData'
import { DEFAULT_CONTEXT } from '@/lib/context/types'

describe('workspaceData', () => {
  it('returns national baseline by default', () => {
    const data = getWorkspaceIcbData(DEFAULT_CONTEXT)
    expect(data.icb_name).toContain('England')
    expect(data.coverage_funnel.eligible).toBeGreaterThan(0)
  })

  it('returns West Yorkshire data for QWO', () => {
    const data = getWorkspaceIcbData({
      ...DEFAULT_CONTEXT,
      geography_type: 'icb',
      geography_id: 'QWO',
      geography_label: 'NHS West Yorkshire Integrated Care Board',
    })
    expect(data.icb_id).toBe('QWO')
    expect(data.deployments.length).toBeGreaterThan(0)
  })

  it('builds coverage funnel stages with percentages', () => {
    const data = getWorkspaceIcbData({
      ...DEFAULT_CONTEXT,
      geography_type: 'icb',
      geography_id: 'QWO',
      geography_label: 'NHS West Yorkshire Integrated Care Board',
    })
    const stages = buildCoverageFunnelStages(data)
    expect(stages).toHaveLength(4)
    expect(stages[0].pct).toBe(100)
    expect(stages[3].pct).toBeLessThan(stages[1].pct!)
  })
})
