'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const SCROLL_THRESHOLD = 400
/** Tailwind `sm` is 640px — hide this control on smaller viewports. */
const SMALL_SCREEN_QUERY = '(max-width: 639px)'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(true)

  useEffect(() => {
    const media = window.matchMedia(SMALL_SCREEN_QUERY)

    function updateVisibility() {
      const small = media.matches
      setIsSmallScreen(small)
      setVisible(!small && window.scrollY > SCROLL_THRESHOLD)
    }

    updateVisibility()
    media.addEventListener('change', updateVisibility)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => {
      media.removeEventListener('change', updateVisibility)
      window.removeEventListener('scroll', updateVisibility)
    }
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isSmallScreen || !visible) return null

  return (
    <Button
      onClick={scrollToTop}
      pill
      size="none"
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 max-sm:hidden gap-2 px-4 py-2 hs-text-label shadow-md"
    >
      <span aria-hidden>↑</span>
      Back to top
    </Button>
  )
}
