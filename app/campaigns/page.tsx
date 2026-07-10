import { permanentRedirect } from 'next/navigation'

/** Legacy `/campaigns` route — Campaigns now lives in the Resource library. */
export default function CampaignsPageLegacyRedirect() {
  permanentRedirect('/resources/campaigns')
}
