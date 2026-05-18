'use client'
import { useApp } from '@/components/AppContext'
import AdmEsc from '@/components/pages/admin/AdmEsc'

export default function AdminEscalationsPage() {
  const { data, setData, notify } = useApp()
  return <AdmEsc data={data} setData={setData} notify={notify} />
}
