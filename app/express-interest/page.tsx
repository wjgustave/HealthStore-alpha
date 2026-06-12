import { redirect } from 'next/navigation'

/** Legacy URL — redirects to /eoi-record. */
export default function ExpressInterestRedirectPage() {
  redirect('/eoi-record')
}
