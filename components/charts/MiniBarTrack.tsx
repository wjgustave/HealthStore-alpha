export default function MiniBarTrack({
  value,
  max = 100,
  width = 80,
  color = '#005eb8',
}: {
  value: number
  max?: number
  width?: number
  color?: string
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const fillWidth = Math.round((pct / 100) * width)

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          display: 'inline-block',
          width,
          height: 10,
          background: '#d8dde0',
          verticalAlign: 'middle',
        }}
      >
        <span
          style={{
            display: 'block',
            width: fillWidth,
            height: 10,
            background: color,
          }}
        />
      </span>
    </span>
  )
}
