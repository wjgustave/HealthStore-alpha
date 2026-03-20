import { getDeviceClassExplainer } from '@/lib/deviceClassExplainer'

export function DeviceClassDetails({ deviceClass }: { deviceClass: string }) {
  const explainer = getDeviceClassExplainer(deviceClass)
  if (!explainer) return null

  return (
    <details className="mt-2">
      <summary
        className="cursor-pointer text-sm font-medium underline-offset-2 hover:underline outline-none rounded-sm focus-visible:ring-2 focus-visible:ring-[#005EB8] focus-visible:ring-offset-2"
        style={{ color: '#005EB8' }}
      >
        {explainer.summary}
      </summary>
      <div
        className="mt-2 text-xs pl-3 border-l-2 leading-relaxed"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        {explainer.body}
      </div>
    </details>
  )
}
