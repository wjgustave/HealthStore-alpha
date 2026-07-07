'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AccountVerifyPage() {
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  function verify() {
    if (code === '123456') {
      setVerified(true)
      setError('')
    } else {
      setError('Incorrect code. Prototype code is 123456.')
    }
  }

  return (
    <>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 16px' }}>Verify your email</h1>
      {verified ? (
        <div className="hs-panel-success">
          <p>Email verified. You can continue to save analyses or request commissioning support.</p>
          <Link href="/workspace" className="hs-btn hs-btn-primary" style={{ marginTop: 12, display: 'inline-flex' }}>Go to workspace</Link>
        </div>
      ) : (
        <>
          <div className="hs-inset">
            <p>Prototype verification. Use code <strong>123456</strong>.</p>
          </div>
          <div className="hs-form-group">
            <label className="hs-label" htmlFor="code">One-time code</label>
            <input className="hs-input hs-input--narrow" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          {error ? <p className="hs-error">{error}</p> : null}
          <button type="button" className="hs-btn hs-btn-primary" onClick={verify}>Verify</button>
        </>
      )}
    </>
  )
}
