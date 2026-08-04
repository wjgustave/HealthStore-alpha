import { permanentRedirect } from 'next/navigation'

/** The opportunities section is hidden — send visitors to the home page. */
export default function OpportunitiesHiddenRedirect() {
  permanentRedirect('/')
}
