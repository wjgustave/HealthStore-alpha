import { ExpressInterestWhiteButton } from '@/components/ExpressInterestWhiteButton'

/** Coloured express-interest callout — used inside How to buy locally (narrative) or below tabs. */
export default function PdpExpressInterestCallout({ accent }: { accent: string }) {
  return (
    <div className="mt-4 rounded-lg overflow-hidden" style={{ background: accent }}>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-section-alt)', color: '#fff', marginBottom: 8 }}>
          Want to find out more?
        </div>
        <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '0 0 16px', maxWidth: 640 }}>
          HealthStore can assess fit, build a business case, and support your local procurement route.
        </p>
        <ExpressInterestWhiteButton accent={accent} />
      </div>
    </div>
  )
}
