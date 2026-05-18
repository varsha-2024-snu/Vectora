'use client'
import { useApp } from '@/components/AppContext'
import AdmUnlock from '@/components/pages/admin/AdmUnlock'

export default function AdminUnlockPage() {
  const { data, setData, notify } = useApp()
  return <AdmUnlock data={data} setData={setData} notify={notify} />
}
