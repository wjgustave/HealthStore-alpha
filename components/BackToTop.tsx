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
      Back to top
      <svg
        aria-hidden
        focusable="false"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M12 20V4" />
        <path d="M5 11l7-7 7 7" />
      </svg>
    </Button>
  )
}
