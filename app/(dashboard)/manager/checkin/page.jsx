'use client'
import { useApp } from '@/components/AppContext'
import MgrCheckin from '@/components/pages/manager/MgrCheckin'

export default function ManagerCheckinPage() {
  const { user, data, setData, nav, sel, notify } = useApp()
  if (!user) return null
  return <MgrCheckin user={user} data={data} setData={setData} nav={nav} sel={sel} notify={notify} />
}
