import { GuidanceArticle } from '@/components/resources/GuidanceArticle'

export const metadata = {
  title: 'Evidence of digital therapeutics (DTx) success — NHS HealthStore',
}

export default function DtxEvidencePage() {
  return (
    <GuidanceArticle title="Evidence of digital therapeutics (DTx) success">
      <p>
        Digital therapeutics (DTx) have been tested extensively in clinical trials. This table shows some of the
        evidence produced in UK trials.
      </p>

      <table className="nhsuk-table">
        <caption className="nhsuk-table__caption">UK trial evidence for digital therapeutics</caption>
        <thead className="nhsuk-table__head">
          <tr className="nhsuk-table__row">
            <th scope="col" className="nhsuk-table__header">
              Condition / trial / rehabilitation
            </th>
            <th scope="col" className="nhsuk-table__header">
              What the evidence shows
            </th>
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
          <tr className="nhsuk-table__row">
            <th scope="row" className="nhsuk-table__header">
              NHS Digital Weight Management trials
            </th>
            <td className="nhsuk-table__cell">
              63,937 referrals; 45% completion; people who finished lost an average of 3.9 kilograms; higher BAME uptake
              than traditional routes
            </td>
          </tr>
          <tr className="nhsuk-table__row">
            <th scope="row" className="nhsuk-table__header">
              COPD: Airedale NHS FT
            </th>
            <td className="nhsuk-table__cell">
              1,000+ COPD patients enrolled in MyCare24 remote monitoring. Trial showed reduced emergency admissions;
              clinician-published statement confirms reduced need for clinical contact.
            </td>
          </tr>
          <tr className="nhsuk-table__row">
            <th scope="row" className="nhsuk-table__header">
              COPD: NHS Grampian
            </th>
            <td className="nhsuk-table__cell">
              Hospital admissions: 6 → 0 at 5 months (a patient had six hospital stays in a previous reference period,
              which dropped to zero inpatient admissions during the first five months following a specific intervention,
              treatment, or milestone); inhaler technique improved from 48% to 91%; rescue inhaler (often called the blue
              inhaler) use down 33%; fewer unscheduled GP appointments.
            </td>
          </tr>
        </tbody>
      </table>

      <p>
        All products on NHS HealthStore have been recommended by NICE. Below are headline outcomes from deployed
        programmes across the two conditions currently available.
      </p>

      <table className="nhsuk-table">
        <caption className="nhsuk-table__caption">Headline outcomes from deployed programmes</caption>
        <thead className="nhsuk-table__head">
          <tr className="nhsuk-table__row">
            <th scope="col" className="nhsuk-table__header">
              Condition
            </th>
            <th scope="col" className="nhsuk-table__header">
              What the evidence shows
            </th>
          </tr>
        </thead>
        <tbody className="nhsuk-table__body">
          <tr className="nhsuk-table__row">
            <th scope="row" className="nhsuk-table__header">
              Cardiac rehabilitation
            </th>
            <td className="nhsuk-table__cell">
              KiActiv, deployed at Liverpool University Hospitals, showed a significant reduction in emergency heart
              failure readmissions. myHeart, developed at Dorset County Hospital, helped the trust exceed NHS
              England&apos;s 2028 cardiac rehab targets.
            </td>
          </tr>
          <tr className="nhsuk-table__row">
            <th scope="row" className="nhsuk-table__header">
              COPD pulmonary rehabilitation
            </th>
            <td className="nhsuk-table__cell">
              KiActiv&apos;s Long COVID programme in Suffolk and North East Essex ICS reported a £9 return for every £1
              spent, with 304 programme completions. Digital pulmonary rehab tools consistently show higher completion
              rates than face-to-face programmes, which nationally reach only 13% of eligible patients.
            </td>
          </tr>
        </tbody>
      </table>
    </GuidanceArticle>
  )
}
