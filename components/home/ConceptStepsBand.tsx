const STEPS = [
  {
    step: '1',
    title: 'Identify local need',
    description: 'Use local prevalence data and service demand to identify which condition areas would benefit from digital therapeutic support.',
  },
  {
    step: '2',
    title: 'Review available apps',
    description: 'Browse apps by condition, evidence strength, NICE status, assurance, deployment effort and cost model.',
  },
  {
    step: '3',
    title: 'Build your case',
    description: 'Use evidence summaries, financial considerations and deployment information to create a commissioner business case.',
  },
] as const

/** Step badge fills: NHS blue, NHS green, NHS purple — V2 concept band only. */
const STEP_BADGE_BG = ['#005EB8', '#007F3B', '#330072'] as const

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

/** V2-only: replaces the stats strip; sits directly under the hero. */
export default function ConceptStepsBand() {
  return (
    <section className="py-5 md:py-6" style={{ background: '#003087' }} aria-labelledby="concept-steps-heading">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          id="concept-steps-heading"
          className="mb-4 text-center text-sm font-semibold md:mb-5 md:text-base"
          style={{ ...fr, color: 'rgba(255,255,255,0.92)' }}
        >
          Simple steps to building a commissioning business case
        </h2>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {STEPS.map((item, index) => (
            <div
              key={item.step}
              className="rounded-lg px-4 py-4 md:px-5 md:py-4"
              style={{ background: 'rgba(0, 94, 184, 0.28)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div
                className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white md:h-9 md:w-9 md:text-sm"
                style={{ background: STEP_BADGE_BG[index] }}
              >
                {item.step}
              </div>
              <h3 className="mb-1.5 text-sm font-bold text-white md:text-base" style={fr}>
                {item.title}
              </h3>
              <p className="m-0 text-xs leading-relaxed md:text-sm" style={{ color: 'rgba(255,255,255,0.82)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
