'use client'

import { useState, useEffect } from 'react'
import ExpressInterestModal from '@/components/ExpressInterestModal'

interface Props {
  app: { app_name: string }
  children: React.ReactNode
  contactPrefill: {
    name: string
    role: string
    organisation: string
    email: string
  }
}

export default function AppDetailClient({ app, children, contactPrefill }: Props) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest('[data-express-interest]')) {
        e.preventDefault()
        setShowModal(true)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      {children}
      <ExpressInterestModal
        appName={app.app_name}
        open={showModal}
        onClose={() => setShowModal(false)}
        contactPrefill={contactPrefill}
      />
    </>
  )
}
