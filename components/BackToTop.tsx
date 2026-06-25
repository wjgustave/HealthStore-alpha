'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const SCROLL_THRESHOLD = 400

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <Button
      onClick={scrollToTop}
      pill
      size="none"
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 gap-2 px-4 py-2.5 text-sm shadow-md"
    >
      <span aria-hidden>↑</span>
      Back to top
    </Button>
  )
}
