import { permanentRedirect } from 'next/navigation'

/** Legacy `/news` route — News now lives in the Resource library. */
export default function NewsPageLegacyRedirect() {
  permanentRedirect('/resources/news')
}
