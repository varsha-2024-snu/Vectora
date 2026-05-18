'use client'
import { useApp } from '@/components/AppContext'
import MgrReports from '@/components/pages/manager/MgrReports'

export default function ManagerReportsPage() {
  const { user, data } = useApp()
  if (!user) return null
  return <MgrReports user={user} data={data} />
}
