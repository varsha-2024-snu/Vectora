'use client'
import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { T } from '@/lib/theme';
import { THRUST, UOM_L, UOM_EX } from '@/lib/seed';
import { uid, validateSheet } from '@/lib/utils';
import { Btn, Card, Label, Chip, UomChip, WeightageBar } from '@/components/ui/BaseComponents';

export default function EmpCreate({ user, data, setData, nav, notify }) {
  const existing=data.sheets.find(s=>s.eid===user.id)
  const sharedGs=existing?data.goals.filter(g=>g.sid===existing.id&&g.ro):[]
  const [rows,setRows]=useState(
    existing&&(existing.status==="draft"||existing.status==="returned")
      ? data.goals.filter(g=>g.sid===existing.id&&!g.ro).map(g=>({...g,tv:g.tv??""}))||[{id:uid(),area:"Revenue",title:"",uom:"numeric_min",tv:"",td:"",w:""}]
      : [{id:uid(),area:"Revenue",title:"",uom:"numeric_min",tv:"",td:"",w:""}]
  )
  const [errs,setErrs]=useState([])
  const sharedW=sharedGs.reduce((s,g)=>s+g.w,0)
  const selfW=rows.reduce((s,r)=>s+(parseFloat(r.w)||0),0)
  const totalW=selfW+sharedW

  function addRow() {
    if(rows.length+sharedGs.length>=8){ notify("Maximum 8 goals per sheet (RULE-V3)","error"); return }
    setRows(r=>[...r,{id:uid(),area:"Revenue",title:"",uom:"numeric_min",tv:"",td:"",w:""}])
  }
  function del(id){ setRows(r=>r.filter(x=>x.id!==id)) }
  function upd(id,k,v){ setRows(r=>r.map(x=>x.id===id?{...x,[k]:v}:x)) }

  function submit() {
    const parsed=rows.map(r=>({...r,w:parseFloat(r.w)||0,tv:r.uom==="timeline"?null:(parseFloat(r.tv)||0),td:r.td||null}))
    const e=validateSheet([...parsed,...sharedGs])
    if(e.length){ setErrs(e); return }
    setErrs([])
    const sid=existing?existing.id:uid()
    const newGoals=parsed.map(r=>({id:r.id,sid,area:r.area,title:r.title,uom:r.uom,tv:r.tv,td:r.td,w:r.w,shared:false,ro:false}))
    if(!existing) {
      setData(d=>({...d,sheets:[...d.sheets,{id:sid,eid:user.id,status:"submitted",locked:false,sub:new Date().toISOString(),apv:null,note:""}],goals:[...d.goals,...newGoals]}))
    } else {
      setData(d=>({...d,sheets:d.sheets.map(s=>s.id===sid?{...s,status:"submitted",sub:new Date().toISOString()}:s),goals:[...d.goals.filter(g=>g.sid!==sid||g.ro),...newGoals]}))
    }
    notify("Goal sheet submitted for manager approval ✓","success")
    nav("e-goals")
  }

  return (
    <div className="page-enter">
      <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:24 }}>
        <Btn onClick={()=>nav("e-goals")} size="sm"><ArrowLeft size={12}/>&nbsp;Back</Btn>
        <div>
          <h2 style={{ fontSize:17,fontWeight:700,color:T.t1,letterSpacing:-.3 }}>{existing&&(existing.status==="draft"||existing.status==="returned")?"Edit Goal Sheet":"Create Goal Sheet"}</h2>
          <p style={{ fontSize:12,color:T.t2,marginTop:2 }}>FY2025-26 · {rows.length+sharedGs.length}/8 goals</p>
        </div>
      </div>

      {errs.length>0&&(
        <Card pad={16} style={{ marginBottom:20,border:`1px solid ${T.red}30` }}>
          {errs.map((e,i)=><div key={i} style={{ fontSize:12,color:T.red,padding:"2px 0" }}>· {e}</div>)}
        </Card>
      )}

      {sharedGs.length>0&&(
        <Card pad={16} style={{ marginBottom:16,border:`1px solid ${T.purple}30` }}>
          <Label>Shared KPI Goals (pushed by manager — read-only target, adjustable weightage)</Label>
          {sharedGs.map(g=>(
            <div key={g.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:T.void,borderRadius:8,marginTop:8 }}>
              <Chip label="Shared" color={T.purple} size="xs"/>
              <span style={{ fontSize:13,color:T.t1,flex:1 }}>{g.title}</span>
              <UomChip uom={g.uom}/>
              <span style={{ fontSize:12,color:T.amber,fontWeight:600 }}>{g.w}%</span>
            </div>
          ))}
        </Card>
      )}

      <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:16 }}>
        {rows.map((r,i)=>(
          <Card key={r.id} pad={18}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
              <div style={{ fontSize:12,fontWeight:600,color:T.t2,textTransform:"uppercase",letterSpacing:.6 }}>Goal {i+1+sharedGs.length}</div>
              {rows.length>1&&<Btn onClick={()=>del(r.id)} variant="danger" size="sm"><X size={11}/>&nbsp;Remove</Btn>}
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
              <div>
                <Label>Thrust Area</Label>
                <select value={r.area} onChange={e=>upd(r.id,"area",e.target.value)}>
                  {THRUST.map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <Label>Measurement Type</Label>
                <select value={r.uom} onChange={e=>upd(r.id,"uom",e.target.value)}>
                  {Object.entries(UOM_L).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                </select>
                {r.uom&&<div style={{ fontSize:10.5,color:T.t3,marginTop:4 }}>{UOM_EX[r.uom]}</div>}
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <Label>Goal Title</Label>
              <input value={r.title} onChange={e=>upd(r.id,"title",e.target.value)} placeholder="e.g. Achieve ₹10Cr annual sales revenue"/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {r.uom==="timeline"?(
                <div>
                  <Label>Deadline Date</Label>
                  <input type="date" value={r.td} onChange={e=>upd(r.id,"td",e.target.value)}/>
                </div>
              ):(
                <div>
                  <Label>Target Value</Label>
                  <input type="number" value={r.tv} onChange={e=>upd(r.id,"tv",e.target.value)} placeholder={r.uom==="zero"?"0":"e.g. 1000000"}/>
                </div>
              )}
              <div>
                <Label>Weightage % (min 10)</Label>
                <input type="number" value={r.w} onChange={e=>upd(r.id,"w",e.target.value)} min="10" max="100" placeholder="e.g. 30"
                  style={{ borderColor:(parseFloat(r.w)||0)<10&&r.w?T.red:undefined }}/>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom:16 }}>
        <Btn onClick={addRow} full style={{ justifyContent:"center" }} disabled={rows.length+sharedGs.length>=8}>
          <Plus size={13}/>&nbsp;Add Goal {rows.length+sharedGs.length>=8?"(limit reached)":""}
        </Btn>
      </div>

      <Card pad={16} style={{ marginBottom:16 }}>
        <WeightageBar total={totalW} sharedW={sharedW}/>
      </Card>

      <Btn onClick={submit} variant="primary" full size="lg" disabled={Math.abs(totalW-100)>0.01} style={{ justifyContent:"center" }}>
        Submit for Manager Approval →
      </Btn>
    </div>
  )
}
