'use client'
import { useApp } from '@/components/AppContext'
import AdmAudit from '@/components/pages/admin/AdmAudit'

export default function AdminAuditPage() {
  const { data } = useApp()
  return <AdmAudit data={data} />
}
