'use client'
import { useApp } from '@/components/AppContext'
import EmpCreate from '@/components/pages/employee/EmpCreate'

export default function EmployeeCreatePage() {
  const { user, data, setData, nav, notify } = useApp()
  if (!user) return null
  return <EmpCreate user={user} data={data} setData={setData} nav={nav} notify={notify} />
}
