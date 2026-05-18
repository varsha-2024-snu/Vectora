'use client'
import React from 'react';
import { T } from '@/lib/theme';
import { fmtD } from '@/lib/utils';
import { SectionTitle, AlertBox, Card, Chip } from '@/components/ui/BaseComponents';

export default function AdmCycles({ data, setData, notify }) {
  return (
    <div className="page-enter">
      <SectionTitle sub="Manage check-in windows · Toggle to force-open for demo">Cycle Management</SectionTitle>
      <AlertBox type="info">Toggle any window ON to force-open it. Employees can only log achievements in an active window (BRD §2.3 RULE-Q1).</AlertBox>
      <Card pad={0} style={{ overflow:"hidden" }}>
        {data.cycles.map((c,i)=>(
          <div key={c.id} className="hov-row" style={{ padding:"16px 22px",borderBottom:i<data.cycles.length-1?`1px solid ${T.border}`:"none",display:"flex",alignItems:"center",gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:3 }}>{c.label}</div>
              <div style={{ fontSize:12,color:T.t2 }}>{fmtD(c.open)} – {fmtD(c.close)}</div>
            </div>
            {c.on
              ?<Chip label="Force-Open ✓" color={T.green}/>
              :<Chip label="Closed" color={T.t2} size="xs"/>}
            <button onClick={()=>{ setData(d=>({...d,cycles:d.cycles.map(x=>x.id===c.id?{...x,on:!x.on}:x)})); notify("Cycle updated","success") }}
              style={{ width:44,height:24,borderRadius:12,background:c.on?T.amber:"#2A2A30",border:"none",cursor:"pointer",position:"relative",padding:0,transition:"background .2s",flexShrink:0 }}>
              <div style={{ width:18,height:18,borderRadius:"50%",background:"white",position:"absolute",top:3,left:c.on?23:3,transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.4)" }}/>
            </button>
          </div>
        ))}
      </Card>
    </div>
  )
}
