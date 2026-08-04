import { permanentRedirect } from 'next/navigation'

/** Legacy `/guidance` — page is hidden; send to Resource library. */
export default function GuidancePageLegacyRedirect() {
  permanentRedirect('/resources')
}
