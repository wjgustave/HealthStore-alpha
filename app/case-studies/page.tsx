import { permanentRedirect } from 'next/navigation'

/** Legacy `/case-studies` — page is hidden; send to Resource library. */
export default function CaseStudiesPageLegacyRedirect() {
  permanentRedirect('/resources')
}
