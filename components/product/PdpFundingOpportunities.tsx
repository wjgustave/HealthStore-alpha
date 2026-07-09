import { PdpSection } from '@/components/PdpSection'
import { RelatedFundingSection } from '@/components/AppDetailSections'

/** Commissioner-facing funding schemes — narrative spine section after How to buy locally. */
export default function PdpFundingOpportunities({ fundingIds }: { fundingIds: string[] }) {
  return (
    <PdpSection
      id="funding-opportunities"
      shareKey="narrative-funding-opportunities"
      title="Funding opportunities"
      description="Cash or adoption support for commissioners — not supplier R&D or NICE reporting obligations (see NICE guidance)."
    >
      <RelatedFundingSection fundingIds={fundingIds} />
    </PdpSection>
  )
}
