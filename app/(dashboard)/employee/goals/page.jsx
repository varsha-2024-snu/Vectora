'use client'
import { useApp } from '@/components/AppContext'
import EmpGoals from '@/components/pages/employee/EmpGoals'

export default function EmployeeGoalsPage() {
  const { user, data, nav } = useApp()
  if (!user) return null
  return <EmpGoals user={user} data={data} nav={nav} />
}
