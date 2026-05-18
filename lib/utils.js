import { USERS } from '@/lib/seed';

export const uid  = () => "v" + Math.random().toString(36).slice(2,9)
export const fmtN = n  => n==null ? "—" : typeof n==="number" ? n.toLocaleString("en-IN") : n
export const fmtD = s  => s ? new Date(s).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"
export const fmtTs= s  => s ? new Date(s).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) : "—"
export const getU = id => USERS.find(u=>u.id===id) || { name:"Unknown", init:"?" }
export const team = mid=> USERS.filter(u=>u.mgr===mid)

export function calcScore(g, val, date) {
  switch(g.uom) {
    case "numeric_min": return !g.tv||val==null ? null : Math.min((val/g.tv)*100,100)
    case "numeric_max": return !g.tv||val==null ? null : val===0 ? 100 : Math.min((g.tv/val)*100,100)
    case "timeline":    return !g.td||!date ? null : new Date(date)<=new Date(g.td) ? 100 : 0
    case "zero":        return val==null ? null : val===0 ? 100 : 0
    default: return null
  }
}
export function overAch(g,v) {
  return (g.uom==="numeric_min"&&g.tv&&v>g.tv) || (g.uom==="numeric_max"&&g.tv&&v<g.tv)
}
export function validateSheet(goals) {
  const e=[]
  if(!goals.length) { e.push("Add at least one goal"); return e }
  if(goals.length>8) e.push("Maximum 8 goals per sheet (RULE-V3)")
  const tot=goals.reduce((s,g)=>s+(parseFloat(g.w)||0),0)
  if(Math.abs(tot-100)>0.01) e.push(`Weightage total is ${tot.toFixed(1)}% — must equal exactly 100% (RULE-V1)`)
  goals.forEach((g,i)=>{
    if((parseFloat(g.w)||0)<10) e.push(`Goal ${i+1}: minimum weightage is 10% (RULE-V2)`)
    if(!g.title?.trim()||g.title.trim().length<3) e.push(`Goal ${i+1}: title must be at least 3 characters`)
    if(g.uom==="timeline"&&!g.td) e.push(`Goal ${i+1}: deadline required for Timeline goals`)
    if(["numeric_min","numeric_max","zero"].includes(g.uom)&&g.tv==null) e.push(`Goal ${i+1}: target value required`)
  })
  return e
}
