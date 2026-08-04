import { permanentRedirect } from 'next/navigation'

/** Legacy `/campaigns` — page is hidden; send to Resource library. */
export default function CampaignsPageLegacyRedirect() {
  permanentRedirect('/resources')
}
