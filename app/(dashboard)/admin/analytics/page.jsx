'use client'
import { useApp } from '@/components/AppContext'
import AdmAnalytics from '@/components/pages/admin/AdmAnalytics'

export default function AdminAnalyticsPage() {
  const { data } = useApp()
  return <AdmAnalytics data={data} />
}
