'use client'
import React from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { T } from '@/lib/theme';
import { USERS } from '@/lib/seed';
import { uid, getU, fmtTs } from '@/lib/utils';
import { SectionTitle, Card, Btn, Chip, EmptyState } from '@/components/ui/BaseComponents';

export default function AdmEsc({ data, setData, notify }) {
  function toggle(id) { setData(d=>({...d,escR:d.escR.map(r=>r.id===id?{...r,on:!r.on}:r)})); notify("Rule updated","success") }
  function updDays(id,v) { setData(d=>({...d,escR:d.escR.map(r=>r.id===id?{...r,days:parseInt(v)||1}:r)})) }
  function runCheck() {
    const newE=[]
    USERS.filter(u=>u.role==="employee").forEach(u=>{
      const sh=data.sheets.find(s=>s.eid===u.id)
      const r1=data.escR.find(r=>r.type==="submission_overdue"&&r.on)
      if(r1&&(!sh||sh.status==="draft")) {
        if(!data.escE.find(e=>e.rid===r1.id&&e.uid===u.id&&!e.done))
          newE.push({id:uid(),rid:r1.id,uid:u.id,over:r1.days+2,at:new Date().toISOString(),done:false})
      }
    })
    if(newE.length) { setData(d=>({...d,escE:[...d.escE,...newE]})); notify(`${newE.length} new escalation(s) flagged`,"warn") }
    else notify("No new escalations found","success")
  }
  function resolve(id) { setData(d=>({...d,escE:d.escE.map(e=>e.id===id?{...e,done:true}:e)})); notify("Resolved ✓","success") }

  return (
    <div className="page-enter">
      <SectionTitle sub="Configurable rule-based escalation chain · BRD §5.3">Escalation Module</SectionTitle>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
        <Card>
          <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:16 }}>Escalation Rules</div>
          {data.escR.map(r=>(
            <div key={r.id} style={{ padding:"12px 0",borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <span style={{ fontSize:13,fontWeight:600,color:T.t1,flex:1 }}>{r.label}</span>
                <button onClick={()=>toggle(r.id)} style={{ width:42,height:22,borderRadius:11,background:r.on?T.amber:"#2A2A30",border:"none",cursor:"pointer",position:"relative",padding:0,transition:"background .2s",flexShrink:0 }}>
                  <div style={{ width:16,height:16,borderRadius:"50%",background:"white",position:"absolute",top:3,left:r.on?23:3,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.5)" }}/>
                </button>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.t2 }}>
                Trigger after
                <input type="number" value={r.days} onChange={e=>updDays(r.id,e.target.value)} min="1" style={{ width:60,padding:"4px 8px",fontSize:12 }}/>
                days overdue
              </div>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <Btn onClick={runCheck} full style={{ justifyContent:"center",background:T.amber,color:"#0A0A0C",border:"none",fontWeight:700 }}>
              <RefreshCw size={13}/>&nbsp;Run Escalation Check
            </Btn>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:4 }}>Escalation Log</div>
          <p style={{ fontSize:12,color:T.t2,marginBottom:14 }}>{data.escE.filter(e=>!e.done).length} open · {data.escE.filter(e=>e.done).length} resolved</p>
          {!data.escE.length&&<EmptyState title="No escalations" desc="Run the check to evaluate current rules."/>}
          {data.escE.map(ev=>{
            const u=getU(ev.uid)
            const r=data.escR.find(x=>x.id===ev.rid)
            return (
              <div key={ev.id} style={{ padding:"10px 0",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{u.name}</div>
                  <div style={{ fontSize:11,color:T.t2 }}>{r?.label} · {ev.over}d overdue</div>
                  <div style={{ fontSize:10.5,color:T.t3 }}>{fmtTs(ev.at)}</div>
                </div>
                {ev.done
                  ?<Chip label="Resolved" color={T.green} size="xs"/>
                  :<Btn size="sm" variant="success" onClick={()=>resolve(ev.id)}><Check size={11}/>&nbsp;Resolve</Btn>}
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
