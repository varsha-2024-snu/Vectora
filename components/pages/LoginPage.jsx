'use client'
import React, { useState } from 'react';
import { T } from '@/lib/theme';
import { USERS } from '@/lib/seed';
import { ROLE_C } from '@/components/Sidebar';
import { Card, Label, AlertBox, Btn, Chip } from '@/components/ui/BaseComponents';
import { ChevronRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email,setEmail]=useState("")
  const [pw,setPw]=useState("")
  const [err,setErr]=useState("")
  function attempt(e) {
    e&&e.preventDefault()
    const u=USERS.find(x=>x.email===email&&x.pw===pw)
    if(!u) { setErr("Invalid credentials. Try the quick-access cards below."); return }
    onLogin(u)
  }
  return (
    <div style={{ minHeight:"100vh",background:T.void,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",padding:24 }}>
      <div style={{ width:"100%",maxWidth:880 }} className="page-enter">
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:12,marginBottom:16 }}>
            <div style={{ width:44,height:44,background:T.amber,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
                <path d="M1 1.5L9 17.5L11 12L13 17.5L21 1.5" stroke="#0A0A0C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:26,fontWeight:800,color:T.t1,letterSpacing:-.6,lineHeight:1 }}>Vectora</div>
              <div style={{ fontSize:11,fontWeight:500,color:T.t2,letterSpacing:.8,marginTop:2 }}>GOAL INTELLIGENCE PLATFORM</div>
            </div>
          </div>
          <p style={{ fontSize:14,color:T.t2,lineHeight:1.6,marginBottom:32 }}>
            Set goals, track achievement, and build a culture of performance across your organization.
          </p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"start" }}>
          <Card pad={28}>
            <div style={{ fontSize:16,fontWeight:700,color:T.t1,marginBottom:4 }}>Sign In</div>
            <p style={{ fontSize:13,color:T.t2,marginBottom:22 }}>Enter your credentials to continue</p>
            {err&&<AlertBox type="err">{err}</AlertBox>}
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute",top:13,left:14,color:T.t3 }}><Mail size={16}/></div>
              <input value={email} onChange={e=>{setEmail(e.target.value);setErr("")}} placeholder="name@company.com" type="email" onKeyDown={e=>e.key==="Enter"&&attempt()}/>
            </div>
            <div style={{ marginBottom:24 }}>
              <Label>Password</Label>
              <input value={pw} onChange={e=>{setPw(e.target.value);setErr("")}} placeholder="••••••••" type="password" onKeyDown={e=>e.key==="Enter"&&attempt()}/>
            </div>
            <Btn onClick={attempt} variant="primary" full size="lg" style={{ justifyContent:"center" }}>
              Sign In →
            </Btn>
            <p style={{ fontSize:12,color:T.t3,textAlign:"center",marginTop:14 }}>All demo accounts use password: Demo@1234</p>
          </Card>
          <div>
            <div style={{ fontSize:11,fontWeight:700,letterSpacing:1.1,textTransform:"uppercase",color:T.t2,marginBottom:14 }}>Quick Access — Demo Roles</div>
            {USERS.map(u=>{
              const rc=ROLE_C[u.role]||T.amber
              return (
                <div key={u.id} onClick={()=>onLogin(u)} className="card btn-anim"
                  style={{ padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:13,background:T.surface }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:`${rc}18`,border:`1px solid ${rc}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:rc,flexShrink:0 }}>{u.init}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:600,color:T.t1 }}>{u.name}</div>
                    <div style={{ fontSize:11,color:T.t2,marginTop:2 }}>{u.email}</div>
                  </div>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
                    <Chip label={u.role} color={rc} size="xs"/>
                    <Chip label={u.dept} color={T.t2} size="xs"/>
                  </div>
                  <ChevronRight size={14} color={T.t3}/>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
