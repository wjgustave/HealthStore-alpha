import type { EditorialImageKey } from '@/lib/editorialPlaceholders'

export type { EditorialImageKey } from '@/lib/editorialPlaceholders'

export type HomeNewsItem = {
  id: string
  title: string
  summary: string
  date: string
  href: string
  topic_tags: string[]
  condition_tags: string[]
  /** Optional hero image variant; omitted uses hash of id */
  image_key?: EditorialImageKey
}

export type HomeEvidenceSpotlight = {
  id: string
  title: string
  dek: string
  date: string
  href: string
  evidence_type: string
  condition_tags: string[]
  image_key?: EditorialImageKey
}

export type HomeCampaignItem = {
  id: string
  title: string
  summary: string
  href: string
  organisation: string
  topic_tags: string[]
  condition_tags: string[]
  image_key?: EditorialImageKey
  /** When true, shown as the large featured card in home V4 campaigns column */
  featured?: boolean
}
