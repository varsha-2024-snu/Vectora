import React from 'react';
import { T } from '../styles/theme';
import { LayoutDashboard, Target, CheckCircle, Users, FileText, CalendarDays, Unlock, Shield, TrendingUp, Zap, LogOut, ChevronRight } from 'lucide-react';

const NAV = {
  employee:[
    { icon:LayoutDashboard, label:"Dashboard",    p:"e-dash"   },
    { icon:Target,           label:"My Goals",     p:"e-goals"  },
    { icon:CheckCircle,      label:"Check-In",     p:"e-checkin"},
  ],
  manager:[
    { icon:LayoutDashboard, label:"Dashboard",    p:"m-dash"    },
    { icon:Users,            label:"Team",         p:"m-team"   },
    { icon:FileText,         label:"Reports",      p:"m-reports"},
  ],
  admin:[
    { icon:LayoutDashboard, label:"Dashboard",    p:"a-dash"     },
    { icon:CalendarDays,     label:"Cycles",       p:"a-cycles"  },
    { icon:Users,            label:"Users",        p:"a-users"   },
    { icon:Unlock,           label:"Unlock Goals", p:"a-unlock"  },
    { icon:Shield,           label:"Audit Trail",  p:"a-audit"   },
    { icon:TrendingUp,       label:"Analytics",    p:"a-analytics"},
    { icon:Zap,              label:"Escalations",  p:"a-esc"     },
  ],
}

export const ROLE_C = { employee:T.amber, manager:"#5B8CF5", admin:"#10D9A4" }

export default function Sidebar({ user, page, nav, logout }) {
  const rc = ROLE_C[user.role]||T.amber
  return (
    <aside style={{ width:234,background:T.base,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0,height:"100%",overflow:"hidden" }}>
      <div style={{ padding:"22px 20px 18px",borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:6 }}>
          <div style={{ width:30,height:30,background:T.amber,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
              <path d="M0.5 1L6 13L8 8.5L10 13L15.5 1" stroke="#0A0A0C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:16,fontWeight:800,color:T.t1,letterSpacing:-.4,lineHeight:1 }}>Vectora</div>
            <div style={{ fontSize:9.5,fontWeight:500,color:T.t2,letterSpacing:.5,marginTop:2 }}>BY ATOMBERG</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1,padding:"10px 10px",overflowY:"auto" }}>
        <div style={{ fontSize:9.5,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:T.t3,padding:"8px 10px 6px" }}>
          {user.role}
        </div>
        {NAV[user.role].map(n=>{
          const active = page===n.p
          return (
            <button key={n.p} onClick={()=>nav(n.p)} className="nav-btn"
              style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,marginBottom:2,color:active?rc:T.t2,background:active?rc+"14":"transparent",fontWeight:active?600:400,fontSize:13 }}>
              <n.icon size={15} strokeWidth={active?2.2:1.8}/>
              {n.label}
              {active&&<div style={{ marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:rc }}/>}
            </button>
          )
        })}
      </nav>
      <div style={{ padding:"14px 14px",borderTop:`1px solid ${T.border}` }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div style={{ width:34,height:34,borderRadius:10,background:`${rc}1A`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:rc,flexShrink:0,border:`1px solid ${rc}30` }}>
            {user.init}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:600,color:T.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:1 }}>
              <div style={{ width:5,height:5,borderRadius:"50%",background:rc }}/>
              <span style={{ fontSize:11,color:T.t2,textTransform:"capitalize" }}>{user.role}</span>
            </div>
          </div>
        </div>
        <button onClick={logout} className="btn-anim" style={{ width:"100%",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,padding:"5px 12px",fontSize:12,borderRadius:8,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600,background:T.raised,color:T.t1,border:`1px solid ${T.border}` }}>
          <LogOut size={12}/>&nbsp;Sign out
        </button>
      </div>
    </aside>
  )
}
