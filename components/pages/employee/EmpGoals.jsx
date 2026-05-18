'use client'
import React from 'react';
import { Edit2, Plus, Lock } from 'lucide-react';
import { T } from '@/lib/theme';
import { fmtD, fmtN } from '@/lib/utils';
import { SectionTitle, Btn, AlertBox, Card, SheetBadge, Chip, AreaChip, UomChip, InfoPill, WeightageBar } from '@/components/ui/BaseComponents';

export default function EmpGoals({ user, data, nav }) {
  const sh=data.sheets.find(s=>s.eid===user.id)
  const gs=sh?data.goals.filter(g=>g.sid===sh.id):[]
  return (
    <div className="page-enter">
      <SectionTitle action={
        sh&&(sh.status==="draft"||sh.status==="returned")&&!sh.locked
          ?<Btn onClick={()=>nav("e-create")} variant="primary" size="sm"><Edit2 size={12}/>&nbsp;Edit Sheet</Btn>
          :sh?null:<Btn onClick={()=>nav("e-create")} variant="primary" size="sm"><Plus size={12}/>&nbsp;Create Sheet</Btn>
      }>My Goal Sheet</SectionTitle>

      {sh?.status==="returned"&&sh.note&&<AlertBox type="warn">Manager feedback: "{sh.note}"</AlertBox>}
      {!sh&&<AlertBox type="info">No goal sheet found. Create one to get started.</AlertBox>}

      {sh&&(
        <Card pad={0} style={{ overflow:"hidden" }}>
          <div style={{ padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>Goals · FY2025-26</div>
            <div style={{ display:"flex",gap:8 }}>
              {sh.locked&&<Chip label="🔒 Locked" color="#F59E0B"/>}
              <SheetBadge status={sh.status}/>
            </div>
          </div>
          {gs.map((g,i)=>(
            <div key={g.id} style={{ padding:"16px 20px",borderBottom:i<gs.length-1?`1px solid ${T.border}`:"none" }}>
              <div style={{ display:"flex",gap:14 }}>
                <div style={{ width:32,height:32,borderRadius:8,background:T.raised,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:T.t2,flexShrink:0,marginTop:1 }}>{i+1}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6 }}>
                    <span style={{ fontSize:14,fontWeight:700,color:T.t1 }}>{g.title}</span>
                    {sh.locked&&<Lock size={12} color="#F59E0B"/>}
                    {g.shared&&<Chip label="Shared KPI" color={T.purple} size="xs"/>}
                  </div>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:8 }}>
                    <AreaChip area={g.area}/><UomChip uom={g.uom}/>
                  </div>
                  <div style={{ display:"flex",gap:20,fontSize:12,color:T.t2,flexWrap:"wrap" }}>
                    <InfoPill label="Target" value={g.uom==="timeline"?fmtD(g.td):fmtN(g.tv)}/>
                    <InfoPill label="Weightage" value={`${g.w}%`} color={T.amber}/>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {gs.length>0&&(
            <div style={{ padding:"14px 20px",borderTop:`1px solid ${T.border}` }}>
              <WeightageBar total={gs.reduce((s,g)=>s+g.w,0)} sharedW={gs.filter(g=>g.shared).reduce((s,g)=>s+g.w,0)}/>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
