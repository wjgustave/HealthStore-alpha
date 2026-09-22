import SupplierOnboardingTaskList from '@/components/supplier-onboard/SupplierOnboardingTaskList'
import { ONBOARDING_NOTICE, SERVICE_NAME } from '@/lib/supplierOnboarding'

export const metadata = { title: `${SERVICE_NAME} — NHS HealthStore` }

/**
 * Supplier onboarding — task list page.
 * NHS "Complete multiple tasks" pattern:
 * https://service-manual.nhs.uk/design-system/patterns/complete-multiple-tasks
 */
export default function SupplierOnboardPage() {
  return (
    <div className="hs-page">
      {/* No breadcrumb: the onboarding journey is a standalone flow (main nav is hidden too). */}
      <div className="max-w-3xl">
        <div className="hs-section">
          <h1 className="page-title-h1">{SERVICE_NAME}</h1>
          <p
            className="m-0 hs-measure leading-relaxed"
            style={{ fontSize: 'var(--text-body)', color: 'var(--text-muted)' }}
          >
            Complete each task below to onboard your product to the NHS HealthStore. You can
            complete the tasks in any order and return to this page at any time.
          </p>
          {/* Blue notice panel — same treatment as the Interoperability panel on product pages
              (PdpAssurancePassport). */}
          <div className="rounded-lg p-4 mt-4" style={{ background: '#E6F0FB', border: '1px solid var(--border)' }}>
            <p className="nhsuk-body-m nhsuk-u-margin-bottom-0" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {ONBOARDING_NOTICE}
            </p>
          </div>
        </div>
        <SupplierOnboardingTaskList />
      </div>
    </div>
  )
}
