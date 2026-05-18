'use client'
import React from 'react';
import { Users, Bell, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { T } from '@/lib/theme';
import { ROLE_C } from '@/components/Sidebar';
import { getU, fmtD, team } from '@/lib/utils';
import { SectionTitle, AlertBox, StatCard, Card, DataTable, SheetBadge, Btn, Chip } from '@/components/ui/BaseComponents';

export default function MgrDash({ user, data, nav, setSel }) {
  const t=team(user.id)
  const sh=data.sheets.filter(s=>t.find(u=>u.id===s.eid))
  const pend=sh.filter(s=>s.status==="submitted").length
  return (
    <div className="page-enter">
      <SectionTitle>Team Dashboard</SectionTitle>
      {pend>0&&<AlertBox type="warn">{pend} goal sheet{pend>1?"s":""} awaiting your approval</AlertBox>}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24 }}>
        <StatCard label="Team Members"    value={t.length}           color={ROLE_C.manager} icon={Users}/>
        <StatCard label="Pending Approval" value={pend}              color="#F59E0B"        icon={Bell}/>
        <StatCard label="Approved"        value={sh.filter(s=>s.status==="approved").length} color={T.green} icon={CheckCircle}/>
        <StatCard label="Returned"        value={sh.filter(s=>s.status==="returned").length} color={T.red} icon={AlertTriangle}/>
      </div>
      <Card pad={0} style={{ overflow:"hidden" }}>
        <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>Team Overview</div>
        </div>
        <DataTable
          cols={[
            { label:"Employee",  render:r=>{ const u=getU(r.eid); return <div style={{ display:"flex",alignItems:"center",gap:10 }}><div style={{ width:30,height:30,borderRadius:8,background:T.raised,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.t2 }}>{u.init}</div><div><div style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{u.name}</div><div style={{ fontSize:11,color:T.t2 }}>{u.dept}</div></div></div>}},
            { label:"Status",    render:r=><SheetBadge status={r.status}/>},
            { label:"Goals",     render:r=><span style={{ fontSize:13,fontWeight:600,color:T.t2 }}>{data.goals.filter(g=>g.sid===r.id).length}</span>},
            { label:"Submitted", render:r=><span style={{ fontSize:12,color:T.t2 }}>{fmtD(r.sub)}</span>},
            { label:"Action",    render:r=>(
              <div style={{ display:"flex",gap:6 }}>
                {r.status==="submitted"&&<Btn variant="primary"  size="sm" onClick={()=>{setSel(r.id);nav("m-review")}}>Review →</Btn>}
                {r.status==="approved" &&<Btn variant="amber"    size="sm" onClick={()=>{setSel(r.id);nav("m-checkin")}}>Check-in</Btn>}
                {(r.status==="draft"||r.status==="returned")&&<Btn size="sm" onClick={()=>{setSel(r.id);nav("m-review")}}><Eye size={11}/>&nbsp;View</Btn>}
              </div>
            )},
          ]}
          rows={sh}
          empty="No team sheets found."
        />
        {t.filter(u=>!sh.find(s=>s.eid===u.id)).map(u=>(
          <div key={u.id} className="hov-row" style={{ padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:30,height:30,borderRadius:8,background:T.raised,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.t2 }}>{u.init}</div>
            <span style={{ fontSize:13,color:T.t2,flex:1 }}>{u.name}</span>
            <Chip label="No sheet created" color={T.t2} size="xs"/>
          </div>
        ))}
      </Card>
    </div>
  )
}
