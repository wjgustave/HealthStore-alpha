import { GuidanceArticle } from '@/components/resources/GuidanceArticle'
import { PREPARING_SECTION } from '../section'

export const metadata = { title: 'What The NHS HealthStore is — NHS HealthStore' }

export default function WhatTheNhsHealthstoreIsPage() {
  return (
    <GuidanceArticle title="What The NHS HealthStore is" section={PREPARING_SECTION}>
      <p>
        The NHS HealthStore is an upcoming digital service being developed by NHS England. It aligns with the NHS
        10-Year Plan and enables NHS patients to easily access NHS-funded therapy through National Institute for Health
        and Care Excellence (NICE)-approved apps. These apps are sometimes called digital therapeutics (DTx), and they
        can help prevent, manage, or treat specific long-term health conditions.
      </p>
      <p>
        The NHS HealthStore makes clinically assured DTx easier to find. It ensures clinicians, commissioners and
        patients are well supported at every stage of their journey.
      </p>

      <h2>For commissioners</h2>
      <p>
        The NHS HealthStore connects suppliers of NICE-approved digital therapeutics (DTx) with commissioners such as
        staff at Integrated Care Boards (ICBs).
      </p>
      <p>The HealthStore helps commissioners to:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          view a catalogue of DTxs evaluated for clinical and cost-effectiveness by the National Institute for Health
          and Care Excellence (NICE)
        </li>
        <li>safely procure and roll out clinically effective digital health technologies at scale</li>
        <li>standardise funding and pricing, protecting NHS budgets</li>
        <li>
          reduce health inequalities by providing patients with access to the same high-quality, NICE-approved DTxs
          regardless of their location
        </li>
      </ul>

      <h2>For clinicians</h2>
      <p>
        When a commissioner begins using the NHS HealthStore, clinicians within their area can recommend digital
        therapeutics (DTx) to their patients.
      </p>
      <p>The NHS HealthStore helps clinicians by:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>providing a suite of clinically validated apps, wearables, and remote monitoring tools</li>
        <li>
          enabling clinicians to deliver first-line treatments and support for long-term health conditions while
          patients wait for appointments
        </li>
        <li>
          promoting patient self-management of minor symptoms and health tracking, enabling clinicians to focus their
          time and resources on complex cases that require direct, face-to-face intervention
        </li>
        <li>
          enabling them to track real-time health data (such as blood pressure or oxygen levels) self-reported by
          patients through their devices
        </li>
      </ul>

      <h2>For patients</h2>
      <p>
        The NHS HealthStore houses NHS-approved health apps recommended by clinicians. These apps help people manage
        long-term health conditions on their own, including mental health conditions, cardiac rehabilitation, and
        insomnia. The apps are sometimes referred to as digital therapeutics (DTx).
      </p>
      <p>The NHS HealthStore helps patients by:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>
          only providing apps that are safe and checked by the National Institute for Health and Care Excellence (NICE)
        </li>
        <li>enabling patients to manage their health without always needing to visit a doctor</li>
        <li>
          enabling patients who are waiting for medical care to use these approved apps to help track and ease symptoms
        </li>
      </ul>

      <h2>For suppliers</h2>
      <p>
        The NHS HealthStore helps suppliers by acting as a single, centralised digital marketplace. It allows software
        and app developers to offer verified health products to patients and NHS staff.
      </p>
      <p>The HealthStore benefits suppliers by:</p>
      <ul className="nhsuk-list nhsuk-list--bullet">
        <li>providing developers with direct access to a huge market of patients and health care workers</li>
        <li>
          enabling a single route to market, meaning they do not need to contact individual hospitals or clinics to sell
          their apps
        </li>
        <li>proving their product is safe, private, and effective by the fact that it has official NHS backing</li>
        <li>making it easier for suppliers to test and launch new digital health tools</li>
      </ul>
    </GuidanceArticle>
  )
}
