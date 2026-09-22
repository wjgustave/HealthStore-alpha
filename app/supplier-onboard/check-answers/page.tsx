import CheckAnswersPage from '@/components/supplier-onboard/CheckAnswersPage'
import { SERVICE_NAME } from '@/lib/supplierOnboarding'

export const metadata = { title: `Check your answers — ${SERVICE_NAME}` }

/** Static segment: takes precedence over the /supplier-onboard/[task] route. */
export default function SupplierOnboardCheckAnswersPage() {
  return <CheckAnswersPage />
}
