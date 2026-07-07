'use client'

import { useRouter } from 'next/navigation'

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }
  return (
    <button type="button" className={className ?? 'nhsuk-header__navigation-link'} onClick={logout}>
      Sign out
    </button>
  )
}
