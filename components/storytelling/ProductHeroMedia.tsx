import type { ReactNode } from 'react'

/**
 * Product hero with split media. [Provenance: Bespoke — extends NHS Hero]
 *
 * NHS Hero is a single full-width band, not a two-column media layout, so this is
 * inferred from NHS tokens: identity/proposition on the left, media on the right,
 * collapsing to one column on small screens. Use the `hs-product-hero__*` element
 * classes (title, supplier, proposition, tags, actions) inside `identity`.
 */
export function ProductHeroMedia({
  identity,
  media,
  className = '',
}: {
  identity: ReactNode
  media: ReactNode
  className?: string
}) {
  return (
    <div className={`hs-product-hero${className ? ` ${className}` : ''}`}>
      <div className="min-w-0">{identity}</div>
      <div className="min-w-0">{media}</div>
    </div>
  )
}

/** 16:9 embedded video frame for the hero media slot. */
export function ProductHeroVideo({
  src,
  title,
  caption,
}: {
  src: string
  title: string
  caption?: ReactNode
}) {
  return (
    <div>
      <div className="hs-product-hero__video">
        <iframe src={src} title={title} allowFullScreen loading="lazy" />
      </div>
      {caption ? <p className="hs-product-hero__video-caption">{caption}</p> : null}
    </div>
  )
}

/** Tinted demo / call-to-action card for the hero media slot. */
export function ProductHeroDemoCard({
  title,
  children,
  links,
  placeholder = false,
}: {
  title: ReactNode
  children?: ReactNode
  links?: ReactNode
  placeholder?: boolean
}) {
  return (
    <div className={`hs-product-hero__demo-card${placeholder ? ' hs-product-hero__demo-card--placeholder' : ''}`}>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
      {links ? <div className="hs-product-hero__demo-links">{links}</div> : null}
    </div>
  )
}

export default ProductHeroMedia
