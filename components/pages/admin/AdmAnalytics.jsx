'use client'
import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { T } from '@/lib/theme';
import { USERS, UOM_L, PIE_C } from '@/lib/seed';
import { ROLE_C } from '@/components/Sidebar';
import { team } from '@/lib/utils';
import { SectionTitle, Card } from '@/components/ui/BaseComponents';

export default function AdmAnalytics({ data }) {
  // Aggregate QoQ performance from real data
  const qoqData = { Q1: { Sales: null, Operations: null }, Q2: { Sales: null, Operations: null }, Q3: { Sales: null, Operations: null }, Q4: { Sales: null, Operations: null } }
  
  data.ach.forEach(a => {
    if (a.sc != null) {
      const g = data.goals.find(x => x.id === a.gid)
      const sheet = data.sheets.find(s => s.id === g?.sid)
      const u = USERS.find(user => user.id === sheet?.eid)
      if (u && (u.dept === 'Sales' || u.dept === 'Operations')) {
        const q = a.q.toUpperCase()
        if (!qoqData[q][u.dept]) qoqData[q][u.dept] = { total: 0, count: 0 }
        qoqData[q][u.dept].total += a.sc
        qoqData[q][u.dept].count += 1
      }
    }
  })

  const qoq = ["Q1", "Q2", "Q3", "Q4"].map(q => ({
    q,
    Sales: qoqData[q].Sales ? Math.round(qoqData[q].Sales.total / qoqData[q].Sales.count) : null,
    Operations: qoqData[q].Operations ? Math.round(qoqData[q].Operations.total / qoqData[q].Operations.count) : null,
  }))
  const byArea  = data.goals.reduce((a,g)=>({...a,[g.area]:(a[g.area]||0)+1}),{})
  const byUom   = data.goals.reduce((a,g)=>({...a,[UOM_L[g.uom]]:(a[UOM_L[g.uom]]||0)+1}),{})
  const byStatus= data.ach.reduce((a,x)=>({...a,[x.st.replace("_"," ")]:(a[x.st.replace("_"," ")]||0)+1}),{})
  const pie = obj => Object.entries(obj).map(([k,v])=>({name:k,value:v}))

  return (
    <div className="page-enter">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <SectionTitle sub="Quarter-on-quarter achievement trends, distribution, and manager effectiveness">Analytics</SectionTitle>
        <button onClick={() => window.open('/api/reports/achievement', '_blank')} className="btn-anim" style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 16px",background:T.surface,color:T.t1,border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer" }}>
          Download CSV
        </button>
      </div>
      <Card style={{ marginBottom:18 }}>
        <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:4 }}>QoQ Achievement Trend · by Department</div>
        <p style={{ fontSize:12,color:T.t2,marginBottom:16 }}>Q2–Q4 will populate as check-ins are entered. Line shows Q1 actuals.</p>
        <div style={{ height:220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qoq} margin={{ top:5,right:20,left:0,bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
              <XAxis dataKey="q" tick={{ fill:T.t2,fontSize:12,fontFamily:"Outfit" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:T.t2,fontSize:12,fontFamily:"Outfit" }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip contentStyle={{ background:T.surface,border:`1px solid ${T.borderM}`,borderRadius:8,fontSize:12,fontFamily:"Outfit" }} labelStyle={{ color:T.t1 }} cursor={{ stroke:T.border }}/>
              <Legend wrapperStyle={{ fontSize:12,color:T.t2,fontFamily:"Outfit" }}/>
              <Line type="monotone" dataKey="Sales"      stroke={T.amber} strokeWidth={2.5} dot={{ fill:T.amber,r:4,strokeWidth:0 }} connectNulls={false}/>
              <Line type="monotone" dataKey="Operations" stroke={ROLE_C.manager} strokeWidth={2.5} dot={{ fill:ROLE_C.manager,r:4,strokeWidth:0 }} connectNulls={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18 }}>
        {[["By Thrust Area",pie(byArea)],["By UoM Type",pie(byUom)],["By Status",pie(byStatus)]].map(([title,pd])=>(
          <Card key={title} style={{ textAlign:"center" }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.t1,marginBottom:12 }}>{title}</div>
            <div style={{ height:140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pd} cx="50%" cy="50%" innerRadius={34} outerRadius={58} dataKey="value" paddingAngle={3}>
                    {pd.map((e,i)=><Cell key={i} fill={PIE_C[i%PIE_C.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ background:T.surface,border:`1px solid ${T.borderM}`,borderRadius:8,fontSize:11,fontFamily:"Outfit" }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"4px 10px",justifyContent:"center",marginTop:8 }}>
              {pd.map((d,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:5,fontSize:10.5,color:T.t2 }}>
                  <div style={{ width:7,height:7,borderRadius:2,background:PIE_C[i%PIE_C.length],flexShrink:0 }}/>
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card pad={0} style={{ overflow:"hidden" }}>
        <div style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontSize:14,fontWeight:700,color:T.t1 }}>Manager Effectiveness</div>
        </div>
        {USERS.filter(u=>u.role==="manager").map(m=>{
          const t=team(m.id)
          const sh=data.sheets.filter(s=>t.find(u=>u.id===s.eid))
          const apv=sh.filter(s=>s.status==="approved").length
          const ci=data.comments.filter(c=>sh.find(s=>s.id===c.sid)).length
          const rate=t.length?Math.round((apv/t.length)*100):0
          return (
            <div key={m.id} className="hov-row" style={{ padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:36,height:36,borderRadius:10,background:`${ROLE_C.manager}18`,border:`1px solid ${ROLE_C.manager}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:ROLE_C.manager }}>{m.init}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14,fontWeight:700,color:T.t1,marginBottom:2 }}>{m.name}</div>
                <div style={{ fontSize:12,color:T.t2 }}>Team {t.length} · Approved {apv} · Comments {ci}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:20,fontWeight:800,color:rate>=80?T.amber:rate>=50?"#F59E0B":T.red,letterSpacing:-.5 }}>{rate}%</div>
                <div style={{ fontSize:10.5,color:T.t2,letterSpacing:.3 }}>COMPLETION</div>
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
