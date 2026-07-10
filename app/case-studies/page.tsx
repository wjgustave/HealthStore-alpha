import { permanentRedirect } from 'next/navigation'

/** Legacy `/case-studies` route — Case studies now lives in the Resource library. */
export default function CaseStudiesPageLegacyRedirect() {
  permanentRedirect('/resources/case-studies')
}
