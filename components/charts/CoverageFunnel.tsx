export type FunnelStage = {
  label: string
  value: number
  pct?: number
  color?: string
}

export default function CoverageFunnel({
  stages,
  maxValue,
  ariaLabel,
}: {
  stages: FunnelStage[]
  maxValue?: number
  ariaLabel: string
}) {
  const max = maxValue ?? stages[0]?.value ?? 1
  const chartWidth = 480
  const startX = 40

  return (
    <div className="hs-chart-wrap">
      <svg className="hs-chart" viewBox="0 0 720 280" role="img" aria-label={ariaLabel}>
        {stages.map((stage, i) => {
          const y = 24 + i * 52
          const w = Math.max(28, (stage.value / max) * chartWidth)
          const fill = stage.color ?? ['#003087', '#005eb8', '#0072ce', '#00a9ce'][i] ?? '#005eb8'
          const textOnBar = w > 160
          return (
            <g key={stage.label}>
              <rect x={startX} y={y} width={w} height={38} rx={4} fill={fill} />
              {textOnBar ? (
                <>
                  <text x={startX + 12} y={y + 25} fill="#fff" fontSize={16} fontWeight={600}>
                    {stage.label}
                  </text>
                  <text x={startX + w - 12} y={y + 25} textAnchor="end" fill="#fff" fontSize={16} fontWeight={600}>
                    {stage.value.toLocaleString()}{stage.pct != null ? ` · ${stage.pct}%` : ''}
                  </text>
                </>
              ) : (
                <text x={startX + w + 10} y={y + 25} fill={fill} fontSize={16} fontWeight={700}>
                  {stage.label}: {stage.value.toLocaleString()}{stage.pct != null ? ` · ${stage.pct}%` : ''}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
