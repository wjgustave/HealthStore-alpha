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

/** Step badge fills: NHS blue, NHS green, NHS purple. */
const STEP_BADGE_BG = ['#005EB8', '#007F3B', '#330072'] as const

const fr = { fontFamily: 'Frutiger, Arial, sans-serif' } as const

/** Three commissioning steps; sits below featured therapeutic band on V2 home (light surface). */
export default function ConceptStepsBand() {
  return (
    <section
      className="rounded-2xl border bg-white py-10 shadow-sm md:py-12"
      style={{ borderColor: 'var(--border)' }}
      aria-labelledby="concept-steps-heading"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2
          id="concept-steps-heading"
          className="mb-8 max-w-3xl text-xl font-bold leading-snug md:text-2xl"
          style={{ ...fr, color: 'var(--text-primary)' }}
        >
          Simple steps to building a commissioning business case
        </h2>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {STEPS.map((item, index) => (
            <div
              key={item.step}
              className="flex flex-col rounded-xl border bg-[#F7F9FC] px-5 py-5 md:px-6 md:py-5"
              style={{ borderColor: 'var(--border)' }}
            >
              <div
                className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white md:h-10 md:w-10 md:text-base"
                style={{ background: STEP_BADGE_BG[index] }}
              >
                {item.step}
              </div>
              <h3 className="mb-2 text-base font-bold md:text-lg" style={{ ...fr, color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
