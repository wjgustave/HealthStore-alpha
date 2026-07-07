'use client'

import Image from 'next/image'
import Link from 'next/link'
import { youtubeEmbedUrl, youtubeVideoIdFromUrl } from '@/lib/youtube'
import type { App } from '@/lib/data'

type DemoVariant = { label: string; url: string }

export default function ProductHero({
  app,
  proposition,
  supervision,
  maturity,
  regulatoryClass,
  supportHref,
  compareHref,
  technicalHref,
}: {
  app: App
  proposition: string
  supervision: string | null
  maturity: string | null
  regulatoryClass?: string
  supportHref: string
  compareHref: string
  technicalHref: string
}) {
  const videos = app.product_videos ?? []
  const primaryVideo = videos[0]
  const videoId = primaryVideo ? youtubeVideoIdFromUrl(primaryVideo.youtube_url) : null
  const demoVariants: DemoVariant[] = app.demo_variants ?? []
  const hasDemo = demoVariants.length > 0 || !!(app.demo_notes && String(app.demo_notes).trim())

  return (
    <section className="hs-product-hero">
      <div className="hs-product-hero__copy">
        <div className="hs-product-hero__identity">
          {app.logo_path ? (
            <Image
              src={app.logo_path}
              alt=""
              width={72}
              height={72}
              className="hs-product-hero__logo"
            />
          ) : null}
          <div>
            <h1 className="hs-product-hero__title">{app.app_name}</h1>
            <p className="hs-product-hero__supplier">
              {app.supplier_name} · {app.condition_tags?.map((t: string) => t.replace(/_/g, ' ')).join(', ')}
            </p>
          </div>
        </div>

        <p className="hs-product-hero__proposition">{proposition}</p>

        <div className="hs-product-hero__tags">
          {supervision ? <span className="hs-tag hs-tag-blue">{supervision}</span> : null}
          {maturity ? <span className="hs-tag hs-tag-grey">{maturity}</span> : null}
          {regulatoryClass ? <span className="hs-tag hs-tag-green">{regulatoryClass}</span> : null}
          {app.catalogue_demo_available ? <span className="hs-tag hs-tag-amber">Demo available</span> : null}
        </div>

        <div className="hs-product-hero__actions">
          <Link href={supportHref} className="hs-btn hs-btn-primary">Get commissioning support</Link>
          <Link href={compareHref} className="hs-btn hs-btn-secondary">Compare products</Link>
        </div>
      </div>

      <div className="hs-product-hero__media">
        {videoId ? (
          <div className="hs-product-hero__video">
            <iframe
              title={primaryVideo?.title?.trim() || `${app.app_name} product overview`}
              src={youtubeEmbedUrl(videoId, false)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {primaryVideo?.title ? (
              <p className="hs-product-hero__video-caption">{primaryVideo.title}</p>
            ) : null}
          </div>
        ) : hasDemo ? (
          <div className="hs-product-hero__demo-card">
            <h2>See what patients and clinicians experience</h2>
            {app.demo_notes ? <p>{app.demo_notes}</p> : null}
            {demoVariants.map((d) => (
              <a
                key={d.url}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hs-btn hs-btn-primary"
                style={{ display: 'inline-flex', marginTop: 12 }}
              >
                {d.label} ↗
              </a>
            ))}
          </div>
        ) : (
          <div className="hs-product-hero__demo-card hs-product-hero__demo-card--placeholder">
            <h2>Commissioner decision support</h2>
            <p>
              HealthStore has nationally assured this product. Your local team still makes the procurement
              decision — we provide the evidence pack and route guidance.
            </p>
          </div>
        )}

        {videoId && hasDemo ? (
          <div className="hs-product-hero__demo-links">
            {demoVariants.map((d) => (
              <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" className="hs-btn hs-btn-secondary">
                {d.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
