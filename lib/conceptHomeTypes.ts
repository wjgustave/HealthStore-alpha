export type ConceptStoryCard = {
  image: string
  title: string
  href: string
  alt?: string
}

export type ConceptPromoCard = {
  id: string
  variant: 'navy' | 'purple'
  title: string
  description: string
  href: string
  image: string
  image_alt?: string
}

export type ConceptCommissionedMetric = {
  label: string
  value: string
  sublabel: string
}

export type ConceptCommissionedWidget = {
  title: string
  illustrative_note: string
  app_display_name: string
  status_label: string
  status_variant: 'live' | 'pilot'
  metrics: ConceptCommissionedMetric[]
  dashboard_label: string
  dashboard_href: string
}

export type ConceptGridContent = {
  story: ConceptStoryCard
  promos: ConceptPromoCard[]
  commissioned: ConceptCommissionedWidget
}

export type ConceptFeaturedContent = {
  featured_app_slug: string
  badge_label: string
  headline: string
  body: string
  right_image: string
  right_image_alt: string
}
