'use client'
import { useApp } from '@/components/AppContext'
import AdmCycles from '@/components/pages/admin/AdmCycles'

export default function AdminCyclesPage() {
  const { data, setData, notify } = useApp()
  return <AdmCycles data={data} setData={setData} notify={notify} />
}
