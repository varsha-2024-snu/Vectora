'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { SEED, USERS } from '@/lib/seed'

const AppContext = createContext(null)

// Map old nav codes to Next.js routes
const ROUTE_MAP = {
  'e-dash':     '/employee/dashboard',
  'e-goals':    '/employee/goals',
  'e-create':   '/employee/goals/create',
  'e-checkin':  '/employee/checkin',
  'm-dash':     '/manager/dashboard',
  'm-team':     '/manager/dashboard',
  'm-review':   '/manager/review',
  'm-checkin':  '/manager/checkin',
  'm-reports':  '/manager/reports',
  'a-dash':     '/admin/dashboard',
  'a-cycles':   '/admin/cycles',
  'a-users':    '/admin/users',
  'a-unlock':   '/admin/unlock',
  'a-audit':    '/admin/audit',
  'a-analytics':'/admin/analytics',
  'a-esc':      '/admin/escalations',
}

// Reverse map: pathname to page code (for sidebar active state)
const PAGE_MAP = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([k, v]) => [v, k])
)

export function AppProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [sel, setSel] = useState(null)
  const [data, setData] = useState({
    cycles:   SEED.cycles,
    sheets:   SEED.sheets,
    goals:    SEED.goals,
    ach:      SEED.ach,
    comments: SEED.comments,
    audit:    SEED.audit,
    escR:     SEED.escR,
    escE:     SEED.escE,
  })
  const [toast, setToast] = useState(null)

  // Navigation helper — accepts old page codes AND new paths
  const nav = useCallback((p, id = null) => {
    if (id !== null) setSel(id)
    const route = ROUTE_MAP[p] || p
    router.push(route)
  }, [router])

  // Get current page code from pathname (for sidebar)
  const page = PAGE_MAP[pathname] || pathname

  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const login = useCallback((u) => {
    setUser(u)
    const route = u.role === 'employee' ? '/employee/dashboard'
               : u.role === 'manager'  ? '/manager/dashboard'
               : '/admin/dashboard'
    router.push(route)
  }, [router])

  const logout = useCallback(() => {
    setUser(null)
    router.push('/login')
  }, [router])

  return (
    <AppContext.Provider value={{
      user, setUser, data, setData, toast, setToast,
      sel, setSel, nav, notify, login, logout, page,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
