'use client'
import { useApp } from '@/components/AppContext'
import EmpCheckin from '@/components/pages/employee/EmpCheckin'

export default function EmployeeCheckinPage() {
  const { user, data, setData, notify } = useApp()
  if (!user) return null
  return <EmpCheckin user={user} data={data} setData={setData} notify={notify} />
}
