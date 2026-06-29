export default function BenchmarkRange({
  p10,
  p90,
  median,
  you,
  youLabel,
  percentileLabel,
  ariaLabel,
}: {
  p10: number
  p90: number
  median: number
  you?: number | null
  youLabel?: string
  percentileLabel?: string
  ariaLabel: string
}) {
  const hasYou = you != null
  const min = (hasYou ? Math.min(p10, you) : p10) - 5
  const max = (hasYou ? Math.max(p90, you) : p90) + 5
  const scale = (v: number) => 60 + ((v - min) / (max - min)) * 460

  const youColor = hasYou
    ? you >= median ? '#007f3b' : you >= p10 ? '#ffb81c' : '#d5281b'
    : '#007f3b'

  return (
    <div className="hs-chart-wrap">
      <svg className="hs-chart" viewBox="0 0 680 140" role="img" aria-label={ariaLabel}>
        <line x1={80} y1={70} x2={600} y2={70} stroke="#d8dde0" />
        <rect x={scale(p10)} y={56} width={scale(p90) - scale(p10)} height={24} rx={4} fill="#cfe0f1" />
        <text x={scale(p10)} y={48} fill="#4c6272" fontSize={16}>{p10}% (P10)</text>
        <text x={scale(p90)} y={48} textAnchor="end" fill="#4c6272" fontSize={16}>{p90}% (P90)</text>
        <line x1={scale(median)} y1={48} x2={scale(median)} y2={86} stroke="#4c6272" strokeWidth={2} strokeDasharray="3 2" />
        <text x={scale(median)} y={104} textAnchor="middle" fill="#4c6272" fontSize={16}>median {median}%</text>
        {hasYou && (
          <>
            <circle cx={scale(you)} cy={68} r={10} fill={youColor} />
            <text x={scale(you)} y={32} textAnchor="middle" fill={youColor} fontSize={18} fontWeight={700}>
              {youLabel ?? `You: ${you}%`}
            </text>
          </>
        )}
        {percentileLabel ? (
          <text x={340} y={128} textAnchor="middle" fill="#4c6272" fontSize={16} fontWeight={700}>
            {percentileLabel}
          </text>
        ) : null}
      </svg>
    </div>
  )
}
