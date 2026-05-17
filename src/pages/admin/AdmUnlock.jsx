import React, { useState } from 'react';
import { Unlock, Lock } from 'lucide-react';
import { T } from '../../styles/theme';
import { USERS } from '../../data/seed';
import { uid } from '../../utils/helpers';
import { SectionTitle, AlertBox, Card, Label, Btn, SheetBadge, Chip } from '../../components/ui/BaseComponents';

export default function AdmUnlock({ data, setData, notify }) {
  const [q,setQ]=useState("")
  const [sel,setSel]=useState(null)
  const [why,setWhy]=useState("")
  const filtered=USERS.filter(u=>u.role==="employee"&&(u.name.toLowerCase().includes(q.toLowerCase())||u.email.includes(q)))

  function unlock() {
    if(!why.trim()){ notify("Reason required","error"); return }
    const sh=data.sheets.find(s=>s.eid===sel.id)
    if(!sh?.locked){ notify("Sheet is not currently locked","error"); return }
    setData(d=>({
      ...d,
      sheets:d.sheets.map(s=>s.id===sh.id?{...s,locked:false,status:"submitted"}:s),
      audit:[{id:uid(),type:"goal_sheet",eid:sh.id,by:"a1",field:"locked",old:"true",nw:"false",act:"unlock",at:new Date().toISOString()},...d.audit]
    }))
    notify(`Sheet unlocked for ${sel.name}. Audit entry created ✓`,"success")
    setSel(null); setWhy(""); setQ("")
  }

  return (
    <div className="page-enter">
      <SectionTitle sub="Unlock a locked sheet · All unlock events are audit-logged (RULE-L3, RULE-A2)">Unlock Goal Sheet</SectionTitle>
      <AlertBox type="warn">Unlocking requires a written reason. This action is irreversible without re-approval.</AlertBox>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
        <Card>
          <Label>Search Employee</Label>
          <input value={q} onChange={e=>{setQ(e.target.value);setSel(null)}} placeholder="Name or email..." style={{ marginBottom:14 }}/>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {filtered.map(u=>{
              const sh=data.sheets.find(s=>s.eid===u.id)
              return (
                <div key={u.id} onClick={()=>setSel(u)} className="btn-anim"
                  style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:sel?.id===u.id?T.amberD:T.void,border:`1px solid ${sel?.id===u.id?T.amber:T.border}`,borderRadius:9,cursor:"pointer",transition:"all .15s" }}>
                  <div style={{ width:32,height:32,borderRadius:8,background:T.raised,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.t2 }}>{u.init}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{u.name}</div>
                    <div style={{ fontSize:11,color:T.t2 }}>{u.email}</div>
                  </div>
                  {sh?<SheetBadge status={sh.status}/>:<Chip label="No sheet" color={T.t2} size="xs"/>}
                  {sh?.locked&&<Lock size={13} color="#F59E0B"/>}
                </div>
              )
            })}
          </div>
        </Card>
        <div>
          {sel?(
            <Card>
              <div style={{ fontSize:15,fontWeight:700,color:T.amber,marginBottom:14 }}>Unlock: {sel.name}</div>
              <Label>Reason for unlock *</Label>
              <textarea value={why} onChange={e=>setWhy(e.target.value)} placeholder="Explain why this sheet needs to be unlocked..." style={{ minHeight:90,resize:"vertical",marginBottom:14 }}/>
              <Btn onClick={unlock} full style={{ justifyContent:"center",background:T.amber,color:"#0A0A0C",border:"none",fontWeight:700 }}>
                <Unlock size={13}/>&nbsp;Unlock & Write Audit Entry
              </Btn>
            </Card>
          ):(
            <div style={{ padding:"48px 24px",textAlign:"center",color:T.t3,fontSize:13 }}>
              Select an employee to unlock their goal sheet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
