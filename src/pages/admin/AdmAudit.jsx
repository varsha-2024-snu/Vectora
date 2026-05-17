import React from 'react';
import { T } from '../../styles/theme';
import { getU, fmtTs } from '../../utils/helpers';
import { SectionTitle, Card, DataTable, Chip } from '../../components/ui/BaseComponents';

export default function AdmAudit({ data }) {
  return (
    <div className="page-enter">
      <SectionTitle sub="Append-only log of all post-lock changes, approvals, and unlocks (RULE-A1, A2, A3)">Audit Trail</SectionTitle>
      <Card pad={0} style={{ overflow:"hidden" }}>
        <DataTable
          cols={[
            { label:"Timestamp",  render:r=><span style={{ fontSize:12,color:T.t2,fontFamily:"monospace" }}>{fmtTs(r.at)}</span>},
            { label:"Changed By", render:r=><span style={{ fontSize:13,fontWeight:600,color:T.t1 }}>{getU(r.by).name}</span>},
            { label:"Entity",     render:r=><Chip label={r.type.replace("_"," ")} color={T.blue} size="xs"/>},
            { label:"Field",      render:r=><span style={{ fontSize:12,color:T.t2 }}>{r.field}</span>},
            { label:"Old",        render:r=><span style={{ fontSize:12,color:T.red,fontFamily:"monospace" }}>{r.old}</span>},
            { label:"New",        render:r=><span style={{ fontSize:12,color:T.green,fontFamily:"monospace" }}>{r.nw}</span>},
            { label:"Action",     render:r=><Chip label={r.act} color={r.act==="unlock"?"#F59E0B":r.act==="approve"?T.green:T.blue} size="xs"/>},
          ]}
          rows={data.audit} empty="No audit entries yet."
        />
      </Card>
    </div>
  )
}
