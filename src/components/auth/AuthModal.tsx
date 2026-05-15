'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

type Mode = 'login' | 'register' | 'forgot'

interface AuthModalProps {
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = getClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onSuccess?.()
        onClose()

      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name || email.split('@')[0] } },
        })
        if (error) throw error
        setMessage('Account created! Check your email to confirm your account, then log in.')
        setMode('login')

      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset`,
        })
        if (error) throw error
        setMessage('Password reset email sent. Check your inbox.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Portal ref — mount at document.body to escape any sticky/z-index stacking context
  const portalRoot = typeof document !== 'undefined' ? document.body : null
  if (!portalRoot) return null

  const modal = (
    <>
      {/* Full-screen backdrop — fixed to viewport */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 9999, background: 'oklch(0% 0 0 / 0.65)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        {/* Centred card */}
        <div
          className="relative w-full max-w-sm rounded-2xl p-8 shadow-2xl"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 24px 80px oklch(0% 0 0 / 0.40)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-fg-muted hover:text-fg-primary transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Logo + title */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🧬</div>
            <h2 className="text-2xl font-bold text-fg-primary">
              {mode === 'login' && 'Sign in'}
              {mode === 'register' && 'Create account'}
              {mode === 'forgot' && 'Reset password'}
            </h2>
            <p className="text-sm text-fg-muted mt-1">BioFlow Blocks</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Display name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="px-4 py-2.5 rounded-xl border border-border bg-surface-2 text-fg-primary text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="px-4 py-2.5 rounded-xl border border-border bg-surface-2 text-fg-primary text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-fg-muted uppercase tracking-wide">Password</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs text-teal-500 hover:text-teal-600">
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={mode === 'register' ? 8 : 1}
                  className="px-4 py-2.5 rounded-xl border border-border bg-surface-2 text-fg-primary text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                />
                {mode === 'register' && (
                  <p className="text-xs text-fg-muted">Minimum 8 characters</p>
                )}
              </div>
            )}

            {error && (
              <div className="px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'var(--color-error)', color: 'white', opacity: 0.9 }}>
                {error}
              </div>
            )}

            {message && (
              <div className="px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'var(--color-success)', color: 'white', opacity: 0.9 }}>
                {message}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 text-base"
            >
              {loading ? 'Please wait…' : (
                mode === 'login' ? 'Sign in' :
                mode === 'register' ? 'Create account' :
                'Send reset email'
              )}
            </Button>
          </form>

          {/* Mode switcher */}
          <div className="mt-6 text-center text-sm text-fg-muted">
            {mode === 'login' && (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => { setMode('register'); setError(null); setMessage(null) }} className="text-teal-500 font-semibold hover:text-teal-600">
                  Sign up
                </button>
              </>
            )}
            {mode === 'register' && (
              <>Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(null); setMessage(null) }} className="text-teal-500 font-semibold hover:text-teal-600">
                  Sign in
                </button>
              </>
            )}
            {mode === 'forgot' && (
              <button onClick={() => { setMode('login'); setError(null); setMessage(null) }} className="text-teal-500 font-semibold hover:text-teal-600">
                ← Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modal, portalRoot)
}
