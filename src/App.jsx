import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { T } from './styles/theme';
import { SEED } from './data/seed';
import { Toast, EmptyState } from './components/ui/BaseComponents';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';

import EmpDash from './pages/employee/EmpDash';
import EmpGoals from './pages/employee/EmpGoals';
import EmpCreate from './pages/employee/EmpCreate';
import EmpCheckin from './pages/employee/EmpCheckin';
import MgrDash from './pages/manager/MgrDash';
import MgrReview from './pages/manager/MgrReview';
import MgrCheckin from './pages/manager/MgrCheckin';
import MgrReports from './pages/manager/MgrReports';
import AdmDash from './pages/admin/AdmDash';
import AdmCycles from './pages/admin/AdmCycles';
import AdmUsers from './pages/admin/AdmUsers';
import AdmUnlock from './pages/admin/AdmUnlock';
import AdmAudit from './pages/admin/AdmAudit';
import AdmAnalytics from './pages/admin/AdmAnalytics';
import AdmEsc from './pages/admin/AdmEsc';

export default function App() {
  const [user, setUser]   = useState(null)
  const [page, setPage]   = useState("login")
  const [sel,  setSel]    = useState(null)
  const [data, setData]   = useState({
    cycles:  SEED.cycles,
    sheets:  SEED.sheets,
    goals:   SEED.goals,
    ach:     SEED.ach,
    comments:SEED.comments,
    audit:   SEED.audit,
    escR:    SEED.escR,
    escE:    SEED.escE,
  })
  const [toast, setToast] = useState(null)

  function nav(p, id=null) { setPage(p); if(id!==null) setSel(id) }
  function notify(msg, type="success") { setToast({msg,type}); setTimeout(()=>setToast(null),3500) }
  function login(u) { setUser(u); nav(u.role==="employee"?"e-dash":u.role==="manager"?"m-dash":"a-dash") }
  function logout() { setUser(null); setPage("login") }

  if(!user) return (
    <LoginPage onLogin={login}/>
  )

  const shared = { user, data, setData, nav, notify, sel, setSel }

  const PAGES = {
    "e-dash":     <EmpDash    {...shared}/>,
    "e-goals":    <EmpGoals   {...shared}/>,
    "e-create":   <EmpCreate  {...shared}/>,
    "e-checkin":  <EmpCheckin {...shared}/>,
    "m-dash":     <MgrDash    {...shared}/>,
    "m-team":     <MgrDash    {...shared}/>,
    "m-review":   <MgrReview  {...shared}/>,
    "m-checkin":  <MgrCheckin {...shared}/>,
    "m-reports":  <MgrReports {...shared}/>,
    "a-dash":     <AdmDash    {...shared}/>,
    "a-cycles":   <AdmCycles  {...shared}/>,
    "a-users":    <AdmUsers   {...shared}/>,
    "a-unlock":   <AdmUnlock  {...shared}/>,
    "a-audit":    <AdmAudit   {...shared}/>,
    "a-analytics":<AdmAnalytics {...shared}/>,
    "a-esc":      <AdmEsc     {...shared}/>,
  }

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Outfit',-apple-system,sans-serif", overflow:"hidden" }}>
      <Sidebar user={user} page={page} nav={nav} logout={logout}/>
      <main key={page} style={{ flex:1, overflowY:"auto", padding:"28px 32px", background:T.void, position:"relative" }}>
        {toast&&<Toast msg={toast.msg} type={toast.type}/>}
        {PAGES[page]||<EmptyState icon={FileText} title={`Page not found: ${page}`} desc="Use the sidebar to navigate."/>}
      </main>
    </div>
  )
}
