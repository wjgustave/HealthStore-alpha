import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import HorizontalBarChart from '@/components/charts/HorizontalBarChart'
import InsightCallout from '@/components/charts/InsightCallout'

describe('chart components', () => {
  it('renders horizontal bar chart with aria label', () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart
        ariaLabel="Test chart"
        rows={[{ label: 'Admissions', value: 40, displayValue: '40%' }]}
        maxValue={50}
      />,
    )
    expect(html).toContain('role="img"')
    expect(html).toContain('aria-label="Admissions 40%"')
    expect(html).toContain('Admissions')
    expect(html).toContain('40%')
  })

  it('renders insight callout with title', () => {
    const html = renderToStaticMarkup(
      <InsightCallout variant="good" title="So what?">
        Coverage gap is the main lever.
      </InsightCallout>,
    )
    expect(html).toContain('So what?')
    expect(html).toContain('Coverage gap is the main lever.')
  })
})
