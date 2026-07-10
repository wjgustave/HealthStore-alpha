import { permanentRedirect } from 'next/navigation'

/** Legacy `/guidance` route — Guidance and evidence now lives in the Resource library. */
export default function GuidancePageLegacyRedirect() {
  permanentRedirect('/resources/guidance')
}
