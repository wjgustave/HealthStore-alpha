'use client'

import { useState, useEffect } from 'react'

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
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold shadow-md transition-colors hover:!bg-[#004B8C] focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: 'var(--nhs-blue)',
        color: '#fff',
        boxShadow: 'var(--shadow-md)',
      }}
      aria-label="Back to top"
    >
      <span aria-hidden>↑</span>
      Back to top
    </button>
  )
}
