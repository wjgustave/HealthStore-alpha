import Image from 'next/image'
import { editorialImageSrc, resolveEditorialImageKey, type EditorialImageKey } from '@/lib/editorialPlaceholders'

type Props = {
  itemId: string
  imageKey?: EditorialImageKey | null
  /** Decorative placeholders — empty string for accessibility */
  alt?: string
  className?: string
  priority?: boolean
}

export function EditorialImage({ itemId, imageKey, alt = '', className = '', priority }: Props) {
  const key = resolveEditorialImageKey(itemId, imageKey ?? undefined)
  return (
    <Image
      src={editorialImageSrc(key)}
      alt={alt}
      fill
      className={className}
      sizes="(max-width: 1024px) 100vw, 480px"
      priority={priority}
    />
  )
}
