import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { T } from '../../styles/theme';
import { uid, calcScore, overAch, fmtD, fmtN, getU } from '../../utils/helpers';
import { SectionTitle, AlertBox, Chip, Btn, Card, ScoreRing, AreaChip, UomChip, InfoPill, Label } from '../../components/ui/BaseComponents';

export default function EmpCheckin({ user, data, setData, notify }) {
  const sh=data.sheets.find(s=>s.eid===user.id)
  const gs=sh?data.goals.filter(g=>g.sid===sh.id):[]
  const [q,setQ]=useState("q1")
  const [local,setLocal]=useState({})
  const active=data.cycles.find(c=>c.on)
  const windowOn=!!active

  function getA(gid) {
    const k=`${gid}-${q}`
    return local[k]!==undefined ? local[k] : data.ach.find(a=>a.gid===gid&&a.q===q)||null
  }
  function updA(gid,field,val) {
    const k=`${gid}-${q}`
    const cur=getA(gid)||{gid,q,val:null,date:null,st:"not_started",sc:null}
    setLocal(l=>({...l,[k]:{...cur,[field]:val}}))
  }
  function save() {
    if(!windowOn){ notify("No active check-in window. Ask Admin to open one.","error"); return }
    const saves=Object.values(local).filter(a=>a.gid)
    const next=saves.map(a=>{
      const g=gs.find(x=>x.id===a.gid)
      if(!g||g.ro) return null
      const sc=calcScore(g,a.val!=null?parseFloat(a.val):null,a.date)
      return {id:uid(),gid:a.gid,q,val:a.val!=null?parseFloat(a.val):null,date:a.date||null,st:a.st||"not_started",sc}
    }).filter(Boolean)
    setData(d=>({...d,ach:[...d.ach.filter(a=>!next.find(n=>n.gid===a.gid&&n.q===q)),...next]}))
    setLocal({})
    notify("Achievements saved for "+q.toUpperCase()+" ✓","success")
  }

  const comment=data.comments.find(c=>c.sid===sh?.id&&c.q===q)

  return (
    <div className="page-enter">
      <SectionTitle sub={active?`${active.label} window is active · ${fmtD(active.open)} – ${fmtD(active.close)}`:"No active check-in window"}>
        Quarterly Check-In
      </SectionTitle>

      {!windowOn&&<AlertBox type="warn">No active check-in window. Contact your Admin to open a window (Admin → Cycles → Toggle).</AlertBox>}
      {windowOn&&<AlertBox type="ok">Check-in window is open · Achievements auto-save on "Save All" below.</AlertBox>}

      <div style={{ display:"flex",gap:6,marginBottom:22 }}>
        {["q1","q2","q3","q4"].map(x=>{
          const isAct=active?.phase===x
          const sel=q===x
          return (
            <button key={x} onClick={()=>setQ(x)}
              style={{ padding:"6px 16px",borderRadius:8,border:"1px solid",borderColor:sel?T.amber:T.border,background:sel?T.amberD:"transparent",color:sel?T.amber:T.t2,fontSize:12,fontWeight:sel?700:500,cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .15s",fontFamily:"'Outfit',sans-serif" }}>
              {x.toUpperCase()} {isAct&&<Chip label="Open" color={T.green} size="xs"/>}
            </button>
          )
        })}
        {windowOn&&<Btn onClick={save} variant="primary" size="sm" style={{ marginLeft:"auto" }}><CheckCircle size={12}/>&nbsp;Save All</Btn>}
      </div>

      {!sh&&<AlertBox type="info">Create your goal sheet first to log check-in achievements.</AlertBox>}

      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {gs.map(g=>{
          const a=getA(g.id)
          const sc=a?.sc??null
          return (
            <Card key={g.id} pad={18}>
              <div style={{ display:"flex",gap:16,alignItems:"flex-start" }}>
                <ScoreRing score={sc} size={54}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6 }}>
                    <span style={{ fontSize:14,fontWeight:700,color:T.t1 }}>{g.title}</span>
                    {g.shared&&<Chip label="Shared KPI · synced" color={T.purple} size="xs"/>}
                    {sc!=null&&sc>=100&&overAch(g,parseFloat(a?.val||"0"))&&<Chip label="⭐ Over-achieved" color={T.amber} size="xs"/>}
                  </div>
                  <div style={{ display:"flex",gap:6,marginBottom:10 }}><AreaChip area={g.area}/><UomChip uom={g.uom}/></div>
                  <div style={{ display:"flex",gap:16,fontSize:12,color:T.t2,marginBottom:g.ro?0:14 }}>
                    <InfoPill label="Target" value={g.uom==="timeline"?fmtD(g.td):fmtN(g.tv)}/>
                    <InfoPill label="Weightage" value={`${g.w}%`} color={T.amber}/>
                  </div>
                  {g.ro?(
                    <p style={{ fontSize:12,color:T.purple }}>🔗 Achievement synced from the KPI primary owner</p>
                  ):(
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10 }}>
                      {g.uom==="timeline"?(
                        <div><Label>Completion Date</Label>
                          <input type="date" value={a?.date||""} onChange={e=>updA(g.id,"date",e.target.value)} disabled={!windowOn}/>
                        </div>
                      ):(
                        <div><Label>Actual Value</Label>
                          <input type="number" value={a?.val??""} onChange={e=>updA(g.id,"val",e.target.value)} disabled={!windowOn} placeholder="Enter actual"/>
                        </div>
                      )}
                      <div><Label>Status</Label>
                        <select value={a?.st||"not_started"} onChange={e=>updA(g.id,"st",e.target.value)} disabled={!windowOn}>
                          <option value="not_started">Not Started</option>
                          <option value="on_track">On Track</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {comment&&(
        <Card pad={18} style={{ marginTop:20,border:`1px solid ${T.purple}28` }}>
          <Label>Manager Check-In Comment · {q.toUpperCase()}</Label>
          <div style={{ fontSize:13,color:T.t1,lineHeight:1.7,margin:"8px 0" }}>"{comment.text}"</div>
          <div style={{ fontSize:12,color:T.t2 }}>— {getU(comment.mid).name} · {fmtD(comment.date)}</div>
        </Card>
      )}
    </div>
  )
}
