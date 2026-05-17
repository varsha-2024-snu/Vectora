import React from 'react';
import { Users, CheckCircle, Bell, AlertTriangle, Lock } from 'lucide-react';
import { T } from '../../styles/theme';
import { USERS } from '../../data/seed';
import { ROLE_C } from '../../components/Sidebar';
import { getU, fmtTs } from '../../utils/helpers';
import { SectionTitle, StatCard, Card, Btn, Chip, SheetBadge } from '../../components/ui/BaseComponents';

export default function AdmDash({ data, nav }) {
  const emps=USERS.filter(u=>u.role==="employee")
  return (
    <div className="page-enter">
      <SectionTitle sub="System-wide overview · Vectora FY2025-26">Admin Dashboard</SectionTitle>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24 }}>
        <StatCard label="Employees"      value={emps.length}                                          color={ROLE_C.admin} icon={Users}/>
        <StatCard label="Approved"       value={data.sheets.filter(s=>s.status==="approved").length}  color={T.green}      icon={CheckCircle}/>
        <StatCard label="Pending"        value={data.sheets.filter(s=>s.status==="submitted").length} color="#F59E0B"       icon={Bell}/>
        <StatCard label="Open Escalations" value={data.escE.filter(e=>!e.done).length}               color={T.red}        icon={AlertTriangle}/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
        <Card pad={0} style={{ overflow:"hidden" }}>
          <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>Recent Audit Log</div>
            <Btn size="sm" onClick={()=>nav("a-audit")}>View All</Btn>
          </div>
          {data.audit.slice(0,4).map(l=>(
            <div key={l.id} className="hov-row" style={{ padding:"10px 20px",borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:3 }}>
                <Chip label={l.act} color={l.act==="unlock"?"#F59E0B":l.act==="approve"?T.green:T.blue} size="xs"/>
                <span style={{ fontSize:12,color:T.t1 }}>{l.field}</span>
                <span style={{ fontSize:11,color:T.t2,marginLeft:"auto" }}>{getU(l.by).name}</span>
              </div>
              <div style={{ fontSize:11,color:T.t3 }}>{fmtTs(l.at)}</div>
            </div>
          ))}
        </Card>
        <Card pad={0} style={{ overflow:"hidden" }}>
          <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>All Sheets · Status</div>
          </div>
          {USERS.filter(u=>u.role==="employee").map(u=>{
            const sh=data.sheets.find(s=>s.eid===u.id)
            return (
              <div key={u.id} className="hov-row" style={{ padding:"10px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:30,height:30,borderRadius:8,background:T.raised,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.t2 }}>{u.init}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{u.name}</div>
                  <div style={{ fontSize:11,color:T.t2 }}>{u.dept}</div>
                </div>
                {sh?<SheetBadge status={sh.status}/>:<Chip label="No Sheet" color={T.t2} size="xs"/>}
                {sh?.locked&&<Lock size={12} color="#F59E0B"/>}
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
