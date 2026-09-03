import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { DURING_APPOINTMENT_SECTION } from '../section'

export const metadata = {
  title: 'Make it clear what is expected of patients and keep it simple — NHS HealthStore',
}

export default function WhatIsExpectedOfPatientsPage() {
  return (
    <GuidanceArticle
      title="Make it clear what is expected of patients and keep it simple"
      section={DURING_APPOINTMENT_SECTION}
    >
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}>
        Using digital therapeutics (DTx) for remote monitoring.
      </p>
      <p>
        In West Yorkshire, patients used MyCare24, a COPD remote monitoring service that ran from Airedale Hospital in
        2021. Patients used the Luscii app, with remote monitoring via a &lsquo;virtual hospital&rsquo; model.
      </p>
      <p>
        Each day, patients provided two readings (pulse and oxygen level, using an oximeter). If a person&apos;s
        readings were out of a safe range, the virtual team were alerted to assist. As one nurse put it, a patient can
        enter a reading at 3am and know someone will call them if there is a concern.
      </p>
      <p>
        The results were positive. Across 232 patients, comparing the six months before and after they began using the
        app, COPD-related hospital days fell by 63% and emergency admissions by 29%.
      </p>
    </GuidanceArticle>
  )
}
