'use client'
import LoginPage from '@/components/pages/LoginPage'
import { useApp } from '@/components/AppContext'

export default function LoginRoute() {
  const { login } = useApp()
  return <LoginPage onLogin={login} />
}
