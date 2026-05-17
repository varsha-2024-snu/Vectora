import React from 'react';
import { Check, X } from 'lucide-react';
import { T } from '../../styles/theme';
import { team, getU } from '../../utils/helpers';
import { SectionTitle, Card, DataTable, ScoreRing, SheetBadge } from '../../components/ui/BaseComponents';

export default function MgrReports({ user, data }) {
  const t=team(user.id)
  const sh=data.sheets.filter(s=>t.find(u=>u.id===s.eid))
  return (
    <div className="page-enter">
      <SectionTitle sub="Team completion and achievement overview">Reports</SectionTitle>
      <Card pad={0} style={{ overflow:"hidden",marginBottom:20 }}>
        <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>Check-In Completion Dashboard</div>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",fontSize:12 }}>
            <thead><tr>
              <th style={{ padding:"10px 16px",textAlign:"left",color:T.t2,fontWeight:600,fontSize:10,letterSpacing:.7,textTransform:"uppercase",borderBottom:`1px solid ${T.border}` }}>Employee</th>
              {["Q1","Q2","Q3","Q4"].flatMap(q=>[`${q} Sub`,`${q} CI`]).map(h=>(
                <th key={h} style={{ padding:"10px 10px",textAlign:"center",color:T.t2,fontWeight:600,fontSize:10,letterSpacing:.7,textTransform:"uppercase",borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {t.map(u=>{
                const s=sh.find(x=>x.eid===u.id)
                const sub=s&&(s.status==="submitted"||s.status==="approved")
                return (
                  <tr key={u.id} className="hov-row" style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{u.name}</div>
                      <div style={{ fontSize:11,color:T.t2 }}>{u.dept}</div>
                    </td>
                    {["q1","q2","q3","q4"].flatMap(q=>{
                      const hasCi=data.comments.some(c=>c.sid===s?.id&&c.q===q)
                      return [
                        <td key={q+"s"} style={{ padding:"8px 10px",textAlign:"center" }}>
                          {!s?<span style={{ color:T.t3 }}>—</span>:sub?<Check size={13} color={T.green}/>:<X size={13} color={T.red}/>}
                        </td>,
                        <td key={q+"c"} style={{ padding:"8px 10px",textAlign:"center" }}>
                          {!s?<span style={{ color:T.t3 }}>—</span>:hasCi?<Check size={13} color={T.green}/>:<X size={13} color={T.t3}/>}
                        </td>
                      ]
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Card pad={0} style={{ overflow:"hidden" }}>
        <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>Q1 Achievement Summary</div>
        </div>
        <DataTable
          cols={[
            { label:"Employee", render:r=>{ const u=getU(r.eid); return <span style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{u.name}</span>}},
            { label:"Goals",    render:r=><span style={{ fontSize:13,color:T.t2,fontWeight:600 }}>{data.goals.filter(g=>g.sid===r.id).length}</span>},
            { label:"Q1 Avg",   render:r=>{
              const gs=data.goals.filter(g=>g.sid===r.id)
              const ac=data.ach.filter(a=>gs.find(g=>g.id===a.gid)&&a.q==="q1"&&a.sc!=null)
              if(!ac.length) return <span style={{ color:T.t3 }}>No data</span>
              return <ScoreRing score={Math.round(ac.reduce((s,a)=>s+a.sc,0)/ac.length)} size={42}/>
            }},
            { label:"Status",   render:r=><SheetBadge status={r.status}/>},
          ]}
          rows={sh} empty="No team sheets."
        />
      </Card>
    </div>
  )
}
