import OnboardingConfirmationPage from '@/components/supplier-onboard/OnboardingConfirmationPage'
import { SERVICE_NAME } from '@/lib/supplierOnboarding'

export const metadata = { title: `Onboarding form submitted — ${SERVICE_NAME}` }

/** Static segment: takes precedence over the /supplier-onboard/[task] route. */
export default function SupplierOnboardConfirmationPage() {
  return <OnboardingConfirmationPage />
}
