import { permanentRedirect } from 'next/navigation'

/** Legacy `/news` — page is hidden; send to Resource library. */
export default function NewsPageLegacyRedirect() {
  permanentRedirect('/resources')
}
