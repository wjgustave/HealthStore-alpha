import { permanentRedirect } from 'next/navigation'

/** Legacy `/how-it-helps` route — the page now lives at `/about`. */
export default function HowItHelpsLegacyRedirect() {
  permanentRedirect('/about')
}
