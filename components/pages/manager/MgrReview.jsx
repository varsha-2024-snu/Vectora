'use client'
import React, { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle, Lock } from 'lucide-react';
import { T } from '@/lib/theme';
import { uid, getU, fmtD, fmtN } from '@/lib/utils';
import { Btn, SheetBadge, Card, Chip, UomChip, AreaChip, Label, InfoPill, WeightageBar, AlertBox, EmptyState } from '@/components/ui/BaseComponents';

export default function MgrReview({ user, data, setData, nav, sel, notify }) {
  const sh=data.sheets.find(s=>s.id===sel)
  const emp=sh?getU(sh.eid):null
  const [eg,setEg]=useState(sh?data.goals.filter(g=>g.sid===sh.id):[])
  const [note,setNote]=useState("")
  const tot=eg.reduce((s,g)=>s+(parseFloat(g.w)||0),0)
  function upd(id,k,v){ setEg(gs=>gs.map(g=>g.id===id?{...g,[k]:v}:g)) }

  function approve() {
    if(sh?.status!=="submitted"){ notify("Only submitted sheets can be approved","error"); return }
    setData(d=>({
      ...d,
      sheets:d.sheets.map(s=>s.id===sh.id?{...s,status:"approved",locked:true,apv:new Date().toISOString()}:s),
      goals:d.goals.map(g=>g.sid===sh.id?eg.find(e=>e.id===g.id)||g:g),
      audit:[{id:uid(),type:"goal_sheet",eid:sh.id,by:user.id,field:"status → locked",old:"submitted / false",nw:"approved / true",act:"approve",at:new Date().toISOString()},...d.audit]
    }))
    notify("Sheet approved and locked ✓","success")
    nav("m-team")
  }
  function returnSh() {
    if(!note.trim()){ notify("Add a comment before returning","error"); return }
    setData(d=>({...d,sheets:d.sheets.map(s=>s.id===sh.id?{...s,status:"returned",note}:s)}))
    notify("Sheet returned with feedback","success")
    nav("m-team")
  }
  if(!sh) return <EmptyState title="Sheet not found" desc="Go back and select a valid team member." cta={<Btn onClick={()=>nav("m-team")}><ArrowLeft size={12}/>&nbsp;Back</Btn>}/>
  return (
    <div className="page-enter">
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
        <Btn onClick={()=>nav("m-team")} size="sm"><ArrowLeft size={12}/>&nbsp;Back</Btn>
        <div>
          <h2 style={{ fontSize:17,fontWeight:700,color:T.t1,letterSpacing:-.3 }}>Review: {emp?.name}</h2>
          <p style={{ fontSize:12,color:T.t2,marginTop:2 }}>Submitted {fmtD(sh.sub)} · {data.goals.filter(g=>g.sid===sh.id).length} goals</p>
        </div>
        <div style={{ marginLeft:"auto",display:"flex",gap:8 }}>
          {sh.locked&&<Chip label="🔒 Locked" color="#F59E0B"/>}
          <SheetBadge status={sh.status}/>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 300px",gap:18 }}>
        <div>
          <Card pad={0} style={{ overflow:"hidden" }}>
            <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}`,fontSize:13,color:T.t2 }}>
              {sh.status==="submitted"?"Edit targets and weightage inline, then approve or return.":"Read-only — sheet is not in submitted state."}
            </div>
            {eg.map((g,i)=>(
              <div key={g.id} style={{ padding:"16px 20px",borderBottom:i<eg.length-1?`1px solid ${T.border}`:"none" }}>
                <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:6 }}>
                      <span style={{ fontSize:14,fontWeight:700,color:T.t1 }}>{g.title}</span>
                      {g.shared&&<Chip label="Shared KPI" color={T.purple} size="xs"/>}
                      <UomChip uom={g.uom}/><AreaChip area={g.area}/>
                    </div>
                    {!g.ro&&sh.status==="submitted"?(
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8 }}>
                        <div>
                          <Label>Target {g.uom==="timeline"?"Date":"Value"}</Label>
                          {g.uom==="timeline"
                            ?<input type="date" value={g.td||""} onChange={e=>upd(g.id,"td",e.target.value)} style={{ fontSize:12,padding:"6px 10px" }}/>
                            :<input type="number" value={g.tv||""} onChange={e=>upd(g.id,"tv",parseFloat(e.target.value))} style={{ fontSize:12,padding:"6px 10px" }}/>
                          }
                        </div>
                        <div>
                          <Label>Weightage %</Label>
                          <input type="number" value={g.w} onChange={e=>upd(g.id,"w",parseFloat(e.target.value)||0)} min="10" max="100" style={{ fontSize:12,padding:"6px 10px" }}/>
                        </div>
                      </div>
                    ):(
                      <div style={{ display:"flex",gap:16,fontSize:12,color:T.t2,marginTop:6 }}>
                        <InfoPill label="Target" value={g.uom==="timeline"?fmtD(g.td):fmtN(g.tv)}/>
                        <InfoPill label="Weightage" value={`${g.w}%`} color={T.amber}/>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ padding:"14px 20px",borderTop:`1px solid ${T.border}` }}>
              <WeightageBar total={tot}/>
            </div>
          </Card>
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {sh.status==="submitted"&&(
            <>
              <Card pad={18} style={{ border:`1px solid ${T.green}28` }}>
                <div style={{ fontSize:14,fontWeight:700,color:T.green,marginBottom:8 }}>Approve Goals</div>
                <p style={{ fontSize:12,color:T.t2,marginBottom:14,lineHeight:1.6 }}>This locks the sheet. The employee cannot edit goals after this action.</p>
                <Btn variant="success" full onClick={approve} disabled={Math.abs(tot-100)>0.01} style={{ justifyContent:"center" }}>
                  <Check size={13}/>&nbsp;Approve & Lock Sheet
                </Btn>
                {Math.abs(tot-100)>0.01&&<p style={{ fontSize:11,color:T.red,marginTop:8 }}>Fix weightage total to 100% first</p>}
              </Card>
              <Card pad={18} style={{ border:`1px solid ${"#F59E0B"}28` }}>
                <div style={{ fontSize:14,fontWeight:700,color:"#F59E0B",marginBottom:8 }}>Return for Rework</div>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Explain what needs to change..." style={{ minHeight:90,resize:"vertical",marginBottom:12 }}/>
                <Btn variant="warning" full onClick={returnSh} disabled={!note.trim()} style={{ justifyContent:"center" }}>
                  <AlertTriangle size={13}/>&nbsp;Return with Feedback
                </Btn>
              </Card>
            </>
          )}
          {sh.status==="approved"&&(
            <Card pad={18} style={{ border:`1px solid ${T.green}28` }}>
              <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:8 }}>
                <Lock size={16} color={T.green}/>
                <span style={{ fontSize:14,fontWeight:700,color:T.green }}>Approved & Locked</span>
              </div>
              <p style={{ fontSize:12,color:T.t2 }}>Approved on {fmtD(sh.apv)}</p>
            </Card>
          )}
          {sh.status==="returned"&&<AlertBox type="warn">Returned with comment: "{sh.note}"</AlertBox>}
        </div>
      </div>
    </div>
  )
}
