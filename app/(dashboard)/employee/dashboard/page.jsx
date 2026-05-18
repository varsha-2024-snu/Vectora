'use client'
import { useApp } from '@/components/AppContext'
import EmpDash from '@/components/pages/employee/EmpDash'

export default function EmployeeDashboardPage() {
  const { user, data, nav } = useApp()
  if (!user) return null
  return <EmpDash user={user} data={data} nav={nav} />
}
