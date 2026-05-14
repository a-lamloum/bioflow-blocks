'use client'

import { useState, useEffect, useRef } from 'react'
import { getClient } from '@/lib/supabase/client'
import { AuthModal } from './AuthModal'
import type { User } from '@supabase/supabase-js'

interface AuthButtonProps {
  variant?: 'light-surface' | 'dark-surface'
}

export function AuthButton({ variant = 'light-surface' }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = getClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setShowMenu(false)
  }

  const isDark = variant === 'dark-surface'

  if (loading) return <div style={{ width: 32, height: 32 }} />

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-focus-ring"
          style={isDark
            ? { background: 'oklch(100% 0 0 / 0.08)', color: 'oklch(88% 0.02 200)' }
            : { background: 'var(--color-teal-50)', color: 'var(--color-teal-700)' }
          }
        >
          Sign in
        </button>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    )
  }

  // Logged in — show avatar + dropdown
  const displayName = user.user_metadata?.display_name ?? user.email?.split('@')[0] ?? 'User'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(v => !v)}
        aria-label="User menu"
        aria-expanded={showMenu}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-block-text transition-all focus-visible:ring-2 focus-visible:ring-focus-ring"
        style={{ background: 'var(--color-teal-500)', boxShadow: '0 2px 0 var(--color-teal-700)' }}
      >
        {initials}
      </button>

      {showMenu && (
        <div
          className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-border bg-surface shadow-lg py-1"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-fg-primary truncate">{displayName}</p>
            <p className="text-xs text-fg-muted truncate">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-4 py-2.5 text-sm text-fg-secondary hover:bg-surface-2 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
