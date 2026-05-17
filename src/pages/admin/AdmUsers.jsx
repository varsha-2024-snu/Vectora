import React from 'react';
import { T } from '../../styles/theme';
import { USERS } from '../../data/seed';
import { ROLE_C } from '../../components/Sidebar';
import { SectionTitle, Card, DataTable, Chip } from '../../components/ui/BaseComponents';

export default function AdmUsers() {
  return (
    <div className="page-enter">
      <SectionTitle sub="View and manage the org hierarchy">User Management</SectionTitle>
      <Card pad={0} style={{ overflow:"hidden" }}>
        <DataTable
          cols={[
            { label:"Name", render:r=>(
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:34,height:34,borderRadius:10,background:`${ROLE_C[r.role]||T.amber}18`,border:`1px solid ${ROLE_C[r.role]||T.amber}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:ROLE_C[r.role]||T.amber }}>
                  {r.init}
                </div>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{r.name}</div>
                  <div style={{ fontSize:11,color:T.t2 }}>{r.email}</div>
                </div>
              </div>
            )},
            { label:"Dept",    render:r=><span style={{ fontSize:12,color:T.t2 }}>{r.dept}</span>},
            { label:"Role",    render:r=><Chip label={r.role} color={ROLE_C[r.role]||T.amber} size="xs"/>},
            { label:"Manager", render:r=>{ const m=USERS.find(u=>u.id===r.mgr); return <span style={{ fontSize:12,color:T.t2 }}>{m?m.name:"—"}</span>}},
          ]}
          rows={USERS}
        />
      </Card>
    </div>
  )
}
