import { permanentRedirect } from 'next/navigation'

/** Legacy `/funding` route — redirects to the Funding index. */
export default function FundingPageLegacyRedirect() {
  permanentRedirect('/funding-index')
}
