import type { CaseStudy } from '@/lib/conceptHomeTypes'
import type { HomeCampaignItem, HomeNewsItem } from '@/lib/homeContentTypes'
import {
  ImpactSection,
  PrototypeNoteSection,
  type HomeDashSlice,
} from './HomeFragments'
import {
  NewsListConcept,
  CampaignsColumnConcept,
} from './concept/ConceptColumns'
import { HomeCaseStudiesBand } from './CaseStudies'
import { HomeStorytelling } from './HomeStorytelling'

type HomePublicContentProps = {
  dash: HomeDashSlice
  news: HomeNewsItem[]
  campaigns: HomeCampaignItem[]
  caseStudies: CaseStudy[]
}

export default function HomePublicContent({
  dash,
  news,
  campaigns,
  caseStudies,
}: HomePublicContentProps) {
  return (
    <>
      <HomeStorytelling />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="flex flex-col gap-12 md:gap-14">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <NewsListConcept news={news} title="News" hrefless seeAllHref="/news" />
            <CampaignsColumnConcept campaigns={campaigns} hrefless seeAllHref="/campaigns" />
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <HomeCaseStudiesBand caseStudies={caseStudies} />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-12 md:pt-14">
        <div className="flex flex-col gap-12 md:gap-14">
          <ImpactSection dash={dash} />
          <PrototypeNoteSection dash={dash} />
        </div>
      </div>
    </>
  )
}
