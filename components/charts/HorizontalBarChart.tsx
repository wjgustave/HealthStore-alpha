export type HorizontalBarRow = {
  label: string
  value: number
  displayValue?: string
  color?: string
}

export default function HorizontalBarChart({
  rows,
  maxValue,
  compareRows,
  compareLabel = 'Comparator',
  primaryLabel = 'HealthStore route',
  ariaLabel,
}: {
  rows: HorizontalBarRow[]
  maxValue?: number
  compareRows?: HorizontalBarRow[]
  compareLabel?: string
  primaryLabel?: string
  ariaLabel: string
}) {
  const max = maxValue ?? Math.max(...rows.map((r) => r.value), ...(compareRows?.map((r) => r.value) ?? [0]), 1)
  const chartWidth = 480
  const labelWidth = 180
  const startX = labelWidth + 14
  const rowHeight = 44

  return (
    <div className="hs-chart-wrap">
      <svg className="hs-chart" viewBox={`0 0 ${startX + chartWidth + 80} ${rows.length * rowHeight + 48}`} role="img" aria-label={ariaLabel}>
        {rows.map((row, i) => {
          const y = 24 + i * rowHeight
          const w = (row.value / max) * chartWidth
          const compare = compareRows?.[i]
          const cw = compare ? (compare.value / max) * chartWidth : 0
          return (
            <g key={row.label}>
              <text x={labelWidth} y={y + 15} textAnchor="end" fill="#4c6272" fontSize={16}>
                {row.label}
              </text>
              <rect x={startX} y={y} width={w} height={20} rx={3} fill={row.color ?? '#005eb8'} />
              <text x={startX + w + 8} y={y + 15} fill="#212b32" fontSize={18} fontWeight={600}>
                {row.displayValue ?? `${row.value}%`}
              </text>
              {compare ? (
                <>
                  <rect x={startX} y={y + 24} width={cw} height={14} rx={2} fill="#41b6e6" />
                  <text x={startX + cw + 8} y={y + 35} fill="#4c6272" fontSize={16}>
                    {compare.displayValue ?? `${compare.value}%`}
                  </text>
                </>
              ) : null}
            </g>
          )
        })}
        {compareRows ? (
          <g transform={`translate(${startX}, ${rows.length * rowHeight + 28})`}>
            <rect x={0} y={0} width={14} height={14} fill="#005eb8" />
            <text x={22} y={12} fontSize={16} fill="#4c6272">{primaryLabel}</text>
            <rect x={160} y={0} width={14} height={14} fill="#41b6e6" />
            <text x={182} y={12} fontSize={16} fill="#4c6272">{compareLabel}</text>
          </g>
        ) : null}
      </svg>
    </div>
  )
}
