'use client'
import { useApp } from '@/components/AppContext'
import AdmDash from '@/components/pages/admin/AdmDash'

export default function AdminDashboardPage() {
  const { data, nav } = useApp()
  return <AdmDash data={data} nav={nav} />
}
