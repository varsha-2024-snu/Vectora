import React from 'react';
import { T } from '../../styles/theme';
import { SHEET_META, UOM_L } from '../../data/seed';

export function Chip({ label, color=T.t2, bg, size="sm" }) {
  const p = size==="xs"?"2px 7px":"3px 10px"
  const fs= size==="xs"?10:11
  return (
    <span style={{ display:"inline-flex",alignItems:"center",padding:p,borderRadius:20,fontSize:fs,fontWeight:600,letterSpacing:.3,color,background:bg||color+"18",whiteSpace:"nowrap",lineHeight:1.4 }}>
      {label}
    </span>
  )
}

export function Btn({ children, onClick, variant="ghost", size="md", disabled, full, style={} }) {
  const vs = {
    primary:{ background:T.amber,     color:"#0A0A0C",   border:"none",   fontWeight:700 },
    success:{ background:T.green,     color:"#fff",      border:"none" },
    danger: { background:T.red,       color:"#fff",      border:"none" },
    warning:{ background:"#D97706",   color:"#fff",      border:"none" },
    ghost:  { background:T.raised,    color:T.t1,        border:`1px solid ${T.border}` },
    subtle: { background:"transparent",color:T.t2,       border:`1px solid ${T.border}` },
    amber:  { background:T.amberD,    color:T.amber,     border:`1px solid rgba(240,165,0,.25)` },
  }
  const sz = { sm:{padding:"5px 12px",fontSize:12,gap:5}, md:{padding:"8px 16px",fontSize:13,gap:7}, lg:{padding:"11px 22px",fontSize:14,gap:8} }
  const v = vs[variant]||vs.ghost, s = sz[size]||sz.md
  return (
    <button onClick={onClick} disabled={disabled} className="btn-anim"
      style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:v.fontWeight||600,...v,...s,opacity:disabled?.42:1,width:full?"100%":undefined,...style }}>
      {children}
    </button>
  )
}

export function Card({ children, pad=20, style={} }) {
  return <div className="card" style={{ padding:pad, ...style }}>{children}</div>
}

export function Label({ children, upper }) {
  return <div style={{ fontSize:11,fontWeight:600,letterSpacing:upper?.8:.3,textTransform:upper?"uppercase":undefined,color:T.t2,marginBottom:6 }}>{children}</div>
}

export function SectionTitle({ children, action, sub }) {
  return (
    <div style={{ display:"flex",alignItems:sub?"flex-start":"center",justifyContent:"space-between",marginBottom:20 }}>
      <div>
        <h2 style={{ fontSize:17,fontWeight:700,color:T.t1,letterSpacing:-.3 }}>{children}</h2>
        {sub&&<p style={{ fontSize:13,color:T.t2,marginTop:3 }}>{sub}</p>}
      </div>
      {action&&<div>{action}</div>}
    </div>
  )
}

export function StatCard({ label, value, color=T.amber, sub, icon:Icon, trend }) {
  return (
    <div style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:"18px 20px",position:"relative",overflow:"hidden" }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11,fontWeight:600,letterSpacing:.7,textTransform:"uppercase",color:T.t2,marginBottom:10 }}>{label}</div>
          <div style={{ fontSize:26,fontWeight:800,color,letterSpacing:-.5,lineHeight:1 }}>{value}</div>
          {sub&&<div style={{ fontSize:11,color:T.t3,marginTop:6 }}>{sub}</div>}
        </div>
        {Icon&&<div style={{ width:34,height:34,borderRadius:8,background:color+"16",display:"flex",alignItems:"center",justifyContent:"center" }}><Icon size={16} color={color}/></div>}
      </div>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg, ${color}40 0%, transparent 100%)` }}/>
    </div>
  )
}

export function SheetBadge({ status }) {
  const m = SHEET_META[status]||SHEET_META.draft
  return <Chip label={m.label} color={m.c} bg={m.bg}/>
}

export function UomChip({ uom }) {
  const c={numeric_min:T.green,numeric_max:"#F59E0B",timeline:T.blue,zero:T.purple}
  return <Chip label={UOM_L[uom]||uom} color={c[uom]||T.t2} size="xs"/>
}

export function AreaChip({ area }) {
  const c={Revenue:T.amber,Operations:"#22D3EE",Customer:T.blue,Safety:T.red,People:T.purple}
  return <Chip label={area} color={c[area]||T.t2} size="xs"/>
}

export function InfoPill({ label, value, color=T.t1 }) {
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:5,fontSize:12,color:T.t2 }}>
      {label}: <b style={{ color,fontWeight:600 }}>{value}</b>
    </span>
  )
}

export function ScoreRing({ score, size=52, animate=true }) {
  const r=18, cx=26, cy=26
  const circ=2*Math.PI*r
  const dash = score!=null ? (score/100)*circ : 0
  const offset = circ-dash
  const c = score==null?T.t3:score>=80?T.amber:score>=50?"#F59E0B":T.red
  if(score==null) return <div style={{ width:size,height:size,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:T.t3,fontWeight:500 }}>—</div>
  return (
    <div style={{ position:"relative",width:size,height:size,flexShrink:0 }}>
      <svg width={size} height={size} viewBox="0 0 52 52">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.raised} strokeWidth={4}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={4}
          strokeDasharray={`${dash} ${circ-dash}`}
          strokeLinecap="round" transform="rotate(-90 26 26)"
          className={animate?"gauge-path":undefined}
          style={animate?{"--dash":offset}:undefined}/>
        <text x={cx} y={cy+4} textAnchor="middle" fill={c} fontSize="10" fontWeight="700" fontFamily="Outfit,sans-serif">{Math.round(score)}%</text>
      </svg>
    </div>
  )
}

export function WeightageBar({ total, sharedW=0 }) {
  const clamped = Math.min(total, 100)
  const exact   = Math.abs(total-100)<0.01
  const over    = total>100
  const c = exact ? T.green : over ? T.red : total>=85 ? T.amber : T.blue
  return (
    <div style={{ background:T.void,borderRadius:10,padding:"14px 16px",border:`1px solid ${c}28` }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
        <span style={{ fontSize:12,color:T.t2,fontWeight:500 }}>
          Total Weightage
          {sharedW>0&&<span style={{ color:T.purple,marginLeft:8,fontWeight:600 }}>·&nbsp;{sharedW}% shared</span>}
        </span>
        <span style={{ fontSize:15,fontWeight:800,color:c,letterSpacing:-.3 }}>{total.toFixed(1)}%</span>
      </div>
      <div style={{ background:T.raised,borderRadius:6,height:5,overflow:"hidden",marginBottom:8 }}>
        <div style={{ width:`${clamped}%`,height:"100%",background:c,borderRadius:6,transition:"width .35s cubic-bezier(.4,0,.2,1)" }}/>
      </div>
      <p style={{ fontSize:11,color:exact?T.green:T.t2,fontWeight:exact?600:400 }}>
        {exact?"✓ Ready to submit — weightage is exactly 100%":over?`⚠ Over by ${(total-100).toFixed(1)}% — reduce weightage on a goal`:`${(100-total).toFixed(1)}% remaining to allocate`}
      </p>
    </div>
  )
}

export function AlertBox({ type="info", children }) {
  const m = {info:{c:T.blue,bg:T.blueD},ok:{c:T.green,bg:T.greenD},warn:{c:"#F59E0B",bg:"rgba(245,158,11,.1)"},err:{c:T.red,bg:T.redD}}
  const s = m[type]||m.info
  return (
    <div style={{ padding:"10px 14px",borderRadius:9,background:s.bg,border:`1px solid ${s.c}30`,color:s.c,fontSize:13,marginBottom:14,lineHeight:1.55 }}>
      {children}
    </div>
  )
}

export function Divider() {
  return <div style={{ height:1,background:T.border,margin:"16px 0" }}/>
}

export function EmptyState({ icon:Icon, title, desc, cta }) {
  return (
    <div style={{ padding:"48px 24px",textAlign:"center" }}>
      {Icon&&<div style={{ width:48,height:48,borderRadius:12,background:T.raised,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}><Icon size={22} color={T.t3}/></div>}
      <div style={{ fontSize:15,fontWeight:600,color:T.t1,marginBottom:6 }}>{title}</div>
      {desc&&<p style={{ fontSize:13,color:T.t2,marginBottom:cta?20:0,maxWidth:280,margin:"0 auto",lineHeight:1.6 }}>{desc}</p>}
      {cta&&<div style={{ marginTop:16 }}>{cta}</div>}
    </div>
  )
}

export function DataTable({ cols, rows, empty }) {
  if(!rows.length) return <EmptyState title={empty||"No data"} desc="Nothing to display yet."/>
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
        <thead>
          <tr>
            {cols.map(c=>(
              <th key={c.key||c.label} style={{ padding:"9px 14px",textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",color:T.t2,borderBottom:`1px solid ${T.border}`,whiteSpace:"nowrap" }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} className="hov-row" style={{ borderBottom:`1px solid ${T.border}` }}>
              {cols.map(c=>(
                <td key={c.key||c.label} style={{ padding:"11px 14px",color:T.t1,verticalAlign:"middle" }}>
                  {c.render?c.render(r):r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Toast({ msg, type }) {
  const c={success:T.green,error:T.red,info:T.blue,warn:T.amber}
  return (
    <div style={{ position:"absolute",top:20,right:20,zIndex:9999,maxWidth:340,padding:"12px 18px",background:T.surface,border:`1px solid ${c[type]||T.amber}`,borderRadius:10,boxShadow:`0 12px 36px rgba(0,0,0,.6),0 0 0 1px ${T.border}`,fontSize:13,fontWeight:500,color:c[type]||T.amber,animation:"slideLeft .22s ease both" }}>
      {msg}
    </div>
  )
}
