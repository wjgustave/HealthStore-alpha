export type RetentionPoint = { day: number; value: number }

export default function RetentionCurve({
  you,
  pooled,
  youLabel = 'Your deployment',
  pooledLabel = 'Pooled comparable',
  ariaLabel,
}: {
  you: RetentionPoint[]
  pooled: RetentionPoint[]
  youLabel?: string
  pooledLabel?: string
  ariaLabel: string
}) {
  const maxDay = Math.max(...you.map((p) => p.day), ...pooled.map((p) => p.day), 180)
  const x = (day: number) => 80 + (day / maxDay) * 540
  const y = (val: number) => 220 - (val / 100) * 190

  const toPoints = (pts: RetentionPoint[]) => pts.map((p) => `${x(p.day)},${y(p.value)}`).join(' ')

  return (
    <div className="hs-chart-wrap">
      <svg className="hs-chart" viewBox="0 0 700 300" role="img" aria-label={ariaLabel}>
        <line x1={76} y1={28} x2={76} y2={220} stroke="#d8dde0" />
        <line x1={76} y1={220} x2={640} y2={220} stroke="#d8dde0" />
        <line x1={76} y1={125} x2={640} y2={125} stroke="#d8dde0" strokeDasharray="3 3" opacity={0.5} />
        <text x={68} y={225} textAnchor="end" fill="#4c6272" fontSize={16}>0%</text>
        <text x={68} y={130} textAnchor="end" fill="#4c6272" fontSize={16}>50%</text>
        <text x={68} y={34} textAnchor="end" fill="#4c6272" fontSize={16}>100%</text>
        <polyline fill="none" stroke="#005eb8" strokeWidth={3} points={toPoints(you)} />
        {you.map((p) => (
          <circle key={`you-${p.day}`} cx={x(p.day)} cy={y(p.value)} r={4} fill="#005eb8" />
        ))}
        <polyline fill="none" stroke="#768692" strokeWidth={2.5} strokeDasharray="5 4" points={toPoints(pooled)} />
        {pooled.map((p) => (
          <circle key={`pool-${p.day}`} cx={x(p.day)} cy={y(p.value)} r={3.5} fill="#768692" />
        ))}
        <text x={80} y={242} textAnchor="middle" fill="#4c6272" fontSize={16}>Day 0</text>
        <text x={x(30)} y={242} textAnchor="middle" fill="#4c6272" fontSize={16}>30</text>
        <text x={x(90)} y={242} textAnchor="middle" fill="#4c6272" fontSize={16}>90</text>
        <text x={x(180)} y={242} textAnchor="middle" fill="#4c6272" fontSize={16}>180 days</text>
      </svg>
      <div className="hs-chart-legend">
        <span><i style={{ background: '#005eb8' }} /> {youLabel}</span>
        <span><i style={{ background: '#768692' }} /> {pooledLabel}</span>
      </div>
    </div>
  )
}
