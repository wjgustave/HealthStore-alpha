import type { CaseStudy } from '@/lib/conceptHomeTypes'
import type { HomeCampaignItem, HomeNewsItem } from '@/lib/homeContentTypes'
import { type HomeDashSlice } from './HomeFragments'
import { HomeCaseStudiesBand } from './CaseStudies'
import { HomeStorytelling } from './HomeStorytelling'

type HomePublicContentProps = {
  dash: HomeDashSlice
  news: HomeNewsItem[]
  campaigns: HomeCampaignItem[]
  caseStudies: CaseStudy[]
}

export default function HomePublicContent({
  dash: _dash,
  news: _news,
  campaigns: _campaigns,
  caseStudies,
}: HomePublicContentProps) {
  return (
    <>
      <HomeStorytelling />

      <div className="mt-12 md:mt-14">
        <HomeCaseStudiesBand caseStudies={caseStudies} />
      </div>
    </>
  )
}
