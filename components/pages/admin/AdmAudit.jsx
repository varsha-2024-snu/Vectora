'use client'
import React from 'react';
import { T } from '@/lib/theme';
import { getU, fmtTs } from '@/lib/utils';
import { SectionTitle, Card, DataTable, Chip } from '@/components/ui/BaseComponents';

export default function AdmAudit({ data }) {
  const auditRows = data.audit || []
  return (
    <div className="page-enter">
      <SectionTitle sub="Append-only log of all post-lock changes, approvals, and unlocks (RULE-A1, A2, A3)">Audit Trail</SectionTitle>
      <Card pad={0} style={{ overflow:"hidden" }}>
        <DataTable
          cols={[
            { label:"Timestamp", render:r=><span style={{ fontSize:12,color:T.t2,fontFamily:"monospace" }}>{fmtTs(r.at)}</span>},
            { label:"Changed By", render:r=><span style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{getU(r.by)?.name || "Unknown"}</span>},
            { label:"Summary",    render:r=><span style={{ fontSize:12,color:T.t1 }}>{r.text || r.field || "—"}</span>},
            { label:"Action",     render:r=>{
              const action = r.act || r.action || "update"
              return <Chip label={action} color={action==="unlock"?"#F59E0B":action==="approve"?T.green:T.blue} size="xs"/>
            }},
          ]}
          rows={auditRows} empty="No audit entries yet."
        />
      </Card>
    </div>
  )
}
