'use client'
import { useApp } from '@/components/AppContext'
import MgrReview from '@/components/pages/manager/MgrReview'

export default function ManagerReviewPage() {
  const { user, data, setData, nav, sel, notify } = useApp()
  if (!user) return null
  return <MgrReview user={user} data={data} setData={setData} nav={nav} sel={sel} notify={notify} />
}
