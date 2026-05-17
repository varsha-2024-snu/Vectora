import React from 'react';
import { Target, CheckCircle, TrendingUp, Eye, Edit2, Plus } from 'lucide-react';
import { T } from '../../styles/theme';
import { SHEET_META } from '../../data/seed';
import { fmtD } from '../../utils/helpers';
import { SectionTitle, StatCard, Card, SheetBadge, Btn, AlertBox, ScoreRing, AreaChip, UomChip, Chip, EmptyState } from '../../components/ui/BaseComponents';

export default function EmpDash({ user, data, nav }) {
  const sh = data.sheets.find(s=>s.eid===user.id)
  const gs = sh ? data.goals.filter(g=>g.sid===sh.id) : []
  const ac = data.ach.filter(a=>gs.find(g=>g.id===a.gid))
  const avg= ac.length ? Math.round(ac.reduce((s,a)=>s+(a.sc||0),0)/ac.length) : null
  return (
    <div className="page-enter">
      <SectionTitle>My Dashboard <span style={{ color:T.t2,fontSize:14,fontWeight:400 }}>· FY2025-26</span></SectionTitle>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24 }}>
        <StatCard label="Sheet Status"  value={sh?SHEET_META[sh.status]?.label:"No Sheet"} color={sh?SHEET_META[sh.status]?.c:T.t2} icon={Target}/>
        <StatCard label="Goals Defined" value={gs.length||"—"} color={T.amber} icon={CheckCircle}/>
        <StatCard label="Q1 Avg Score"  value={avg!=null?`${avg}%`:"—"} color={avg!=null?(avg>=80?T.amber:avg>=50?"#F59E0B":T.red):T.t2} icon={TrendingUp}/>
      </div>

      {sh&&(
        <>
          <Card pad={22} style={{ marginBottom:16 }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:sh.status==="returned"?16:12 }}>
              <div>
                <div style={{ fontSize:15,fontWeight:700,color:T.t1 }}>Goal Sheet</div>
                <div style={{ fontSize:12,color:T.t2,marginTop:3 }}>Submitted {fmtD(sh.sub)}</div>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                {sh.locked&&<Chip label="🔒 Locked" color="#F59E0B"/>}
                <SheetBadge status={sh.status}/>
              </div>
            </div>
            {sh.status==="returned"&&sh.note&&<AlertBox type="warn">Manager feedback: "{sh.note}"</AlertBox>}
            <div style={{ display:"flex",gap:8 }}>
              <Btn onClick={()=>nav("e-goals")} variant="amber" size="sm"><Eye size={12}/>&nbsp;View Goals</Btn>
              {(sh.status==="draft"||sh.status==="returned")&&<Btn onClick={()=>nav("e-create")} size="sm"><Edit2 size={12}/>&nbsp;Edit Sheet</Btn>}
              <Btn onClick={()=>nav("e-checkin")} size="sm"><CheckCircle size={12}/>&nbsp;Q1 Check-in</Btn>
            </div>
          </Card>

          <Card pad={22}>
            <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:16 }}>Q1 Goal Progress</div>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {gs.map(g=>{
                const a=data.ach.find(x=>x.gid===g.id&&x.q==="q1")
                return (
                  <div key={g.id} style={{ display:"flex",alignItems:"center",gap:14,padding:"11px 14px",background:T.void,borderRadius:9,border:`1px solid ${T.border}` }}>
                    <ScoreRing score={a?.sc??null} size={46}/>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:600,color:T.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4 }}>{g.title}</div>
                      <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                        <AreaChip area={g.area}/><UomChip uom={g.uom}/>
                        {a&&<Chip label={a.st.replace("_"," ")} color={a.st==="completed"?T.green:a.st==="on_track"?T.amber:T.t2} size="xs"/>}
                        {g.shared&&<Chip label="Shared KPI" color={T.purple} size="xs"/>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right",flexShrink:0 }}>
                      <div style={{ fontSize:12,color:T.t2 }}>{g.w}% wt</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </>
      )}

      {!sh&&<EmptyState icon={Target} title="No goal sheet yet" desc="Create your goal sheet for FY2025-26 and submit it for manager approval." cta={<Btn variant="primary" onClick={()=>nav("e-create")}><Plus size={13}/>&nbsp;Create Goal Sheet</Btn>}/>}
    </div>
  )
}
