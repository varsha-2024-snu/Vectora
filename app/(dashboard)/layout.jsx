'use client'
import { useApp } from '@/components/AppContext'
import Sidebar from '@/components/Sidebar'
import { Toast, EmptyState } from '@/components/ui/BaseComponents'
import { T } from '@/lib/theme'
import { FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }) {
  const { user, page, nav, logout, toast } = useApp()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Outfit',-apple-system,sans-serif", overflow: 'hidden' }}>
      <Sidebar user={user} page={page} nav={nav} logout={logout} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', background: T.void, position: 'relative' }}>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
        {children}
      </main>
    </div>
  )
}
