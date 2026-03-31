export default function CatalogueSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div style={{ height: 32, width: 280, background: 'var(--border)', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ height: 16, width: 200, background: 'var(--border)', borderRadius: 4 }} />
      </div>
      <div className="rounded-xl border p-4 mb-4" style={{ borderColor: 'var(--border)', background: '#fff' }}>
        <div style={{ height: 20, width: 220, background: 'var(--border)', borderRadius: 4, marginBottom: 16 }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 72, background: 'var(--border)', borderRadius: 8, opacity: 0.45 }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <div style={{ height: 44, width: 120, background: 'var(--border)', borderRadius: 8, opacity: 0.45 }} />
          <div style={{ height: 44, width: 180, background: 'var(--border)', borderRadius: 8, opacity: 0.45 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ height: 240, background: 'var(--border)', borderRadius: 12, opacity: 0.4 }} />
        ))}
      </div>
    </div>
  )
}
