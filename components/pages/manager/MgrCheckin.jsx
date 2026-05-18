'use client'
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { T } from '@/lib/theme';
import { ROLE_C } from '@/components/Sidebar';
import { uid, getU, fmtD, fmtN } from '@/lib/utils';
import { EmptyState, Btn, Card, ScoreRing, InfoPill, Chip } from '@/components/ui/BaseComponents';

export default function MgrCheckin({ user, data, setData, nav, sel, notify }) {
  const sh=data.sheets.find(s=>s.id===sel)
  const emp=sh?getU(sh.eid):null
  const gs=sh?data.goals.filter(g=>g.sid===sh.id):[]
  const [q,setQ]=useState("q1")
  const [txt,setTxt]=useState("")
  const existing=data.comments.find(c=>c.sid===sh?.id&&c.q===q&&c.mid===user.id)

  async function save() {
    if(!txt.trim()){ notify("Enter a comment first","error"); return }
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheet_id: sh.id, quarter: q, manager_id: user.id, comment_text: txt })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to save comment')
      if (typeof window !== 'undefined' && window.refetchData) await window.refetchData()
      setTxt(""); notify("Check-in comment saved ✓","success")
    } catch (err) { notify(err.message, "error") }
  }
  if(!sh) return <EmptyState title="Sheet not found" cta={<Btn onClick={()=>nav("m-team")}><ArrowLeft size={12}/>&nbsp;Back</Btn>}/>
  return (
    <div className="page-enter">
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
        <Btn onClick={()=>nav("m-team")} size="sm"><ArrowLeft size={12}/>&nbsp;Back</Btn>
        <h2 style={{ fontSize:17,fontWeight:700,color:T.t1,letterSpacing:-.3 }}>Check-In: {emp?.name}</h2>
      </div>
      <div style={{ display:"flex",gap:6,marginBottom:20 }}>
        {["q1","q2","q3","q4"].map(x=>(
          <button key={x} onClick={()=>setQ(x)} style={{ padding:"6px 14px",borderRadius:8,border:"1px solid",borderColor:q===x?ROLE_C.manager:T.border,background:q===x?ROLE_C.manager+"18":"transparent",color:q===x?ROLE_C.manager:T.t2,fontSize:12,fontWeight:q===x?700:500,cursor:"pointer",transition:"all .15s",fontFamily:"'Outfit',sans-serif" }}>{x.toUpperCase()}</button>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:18 }}>
        <Card pad={0} style={{ overflow:"hidden" }}>
          <div style={{ padding:"12px 20px",borderBottom:`1px solid ${T.border}`,fontSize:11,fontWeight:700,letterSpacing:.7,textTransform:"uppercase",color:T.t2 }}>Planned vs. Actual · {q.toUpperCase()}</div>
          {gs.map(g=>{
            const a=data.ach.find(x=>x.gid===g.id&&x.q===q)
            return (
              <div key={g.id} style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14 }}>
                <ScoreRing score={a?.sc??null} size={46}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,fontWeight:600,color:T.t1,marginBottom:5 }}>{g.title}</div>
                  <div style={{ display:"flex",gap:14,fontSize:12,color:T.t2,flexWrap:"wrap" }}>
                    <InfoPill label="Planned" value={g.uom==="timeline"?fmtD(g.td):fmtN(g.tv)}/>
                    <InfoPill label="Actual"  value={a?(g.uom==="timeline"?fmtD(a.date):fmtN(a.val)):"Not entered"} color={a?T.amber:T.t3}/>
                    {a&&<Chip label={a.st.replace("_"," ")} color={a.st==="completed"?T.green:a.st==="on_track"?T.amber:T.t2} size="xs"/>}
                  </div>
                </div>
              </div>
            )
          })}
        </Card>
        <div>
          <Card pad={18}>
            <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:4 }}>Check-In Comment</div>
            <p style={{ fontSize:12,color:T.t2,marginBottom:14 }}>Document the discussion, highlight progress, note any risks.</p>
            {existing&&(
              <div style={{ background:T.void,borderRadius:8,padding:"10px 12px",marginBottom:12,border:`1px solid ${T.border}` }}>
                <div style={{ fontSize:13,color:T.t1,lineHeight:1.6 }}>"{existing.text}"</div>
                <div style={{ fontSize:11,color:T.t2,marginTop:5 }}>{fmtD(existing.date)}</div>
              </div>
            )}
            <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Discuss Q1 performance..." style={{ minHeight:100,resize:"vertical",marginBottom:12 }}/>
            <Btn onClick={save} disabled={!txt.trim()} full style={{ justifyContent:"center",background:ROLE_C.manager,color:"#fff",border:"none" }}>
              <CheckCircle size={13}/>&nbsp;Save Comment
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  )
}
