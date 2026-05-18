'use client'
import { useApp } from '@/components/AppContext'
import MgrDash from '@/components/pages/manager/MgrDash'

export default function ManagerDashboardPage() {
  const { user, data, nav, setSel } = useApp()
  if (!user) return null
  return <MgrDash user={user} data={data} nav={nav} setSel={setSel} />
}
