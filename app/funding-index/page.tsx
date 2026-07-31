import { permanentRedirect } from 'next/navigation'

/** Legacy `/funding-index` — redirects to `/funding`. */
export default function FundingIndexLegacyRedirect() {
  permanentRedirect('/funding')
}
