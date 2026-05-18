import { T } from '@/lib/theme';

export const USERS = [
  { id:"e1", email:"employee1@demo.com", pw:"Demo@1234", name:"Arjun Sharma",   role:"employee", dept:"Sales",      mgr:"m1", init:"AS" },
  { id:"e2", email:"employee2@demo.com", pw:"Demo@1234", name:"Priya Nair",     role:"employee", dept:"Sales",      mgr:"m1", init:"PN" },
  { id:"e3", email:"employee3@demo.com", pw:"Demo@1234", name:"Rahul Mehta",    role:"employee", dept:"Operations", mgr:"m1", init:"RM" },
  { id:"m1", email:"manager@demo.com",   pw:"Demo@1234", name:"Deepa Krishnan", role:"manager",  dept:"Sales",      mgr:null, init:"DK" },
  { id:"a1", email:"admin@demo.com",     pw:"Demo@1234", name:"Admin User",     role:"admin",    dept:"HR",         mgr:null, init:"AU" },
]
export const THRUST = ["Revenue","Operations","Customer","Safety","People"]
export const UOM_L  = { numeric_min:"Numeric ↑", numeric_max:"Numeric ↓", timeline:"Timeline", zero:"Zero-Based" }
export const UOM_EX = { numeric_min:"Higher is better · e.g. Sales Revenue", numeric_max:"Lower is better · e.g. TAT, Cost", timeline:"On/before deadline = 100%", zero:"Zero = Success · e.g. Safety Incidents" }
export const SHEET_META = {
  draft:     { label:"Draft",     c:T.t2,    bg:"rgba(116,117,127,0.1)" },
  submitted: { label:"Submitted", c:"#F59E0B", bg:"rgba(245,158,11,0.1)" },
  approved:  { label:"Approved",  c:T.green,  bg:T.greenD },
  returned:  { label:"Returned",  c:T.red,    bg:T.redD },
}
export const PIE_C = [T.amber,"#22D3EE","#A855F7","#10B981","#F87171","#60A5FA"]
export const SEED = {
  cycles:[
    { id:"c1", phase:"goal_setting", label:"Goal Setting",  open:"2025-05-01", close:"2025-06-30", on:false },
    { id:"c2", phase:"q1",           label:"Q1 Check-in",   open:"2025-07-01", close:"2025-09-30", on:true  },
    { id:"c3", phase:"q2",           label:"Q2 Check-in",   open:"2025-10-01", close:"2025-12-31", on:false },
    { id:"c4", phase:"q3",           label:"Q3 Check-in",   open:"2026-01-01", close:"2026-03-31", on:false },
    { id:"c5", phase:"q4",           label:"Q4 / Annual",   open:"2026-03-01", close:"2026-04-30", on:false },
  ],
  sheets:[
    { id:"s1", eid:"e1", status:"approved",  locked:true,  sub:"2025-05-10", apv:"2025-05-12", note:"" },
    { id:"s2", eid:"e2", status:"submitted", locked:false, sub:"2025-05-11", apv:null,          note:"" },
    { id:"s3", eid:"e3", status:"returned",  locked:false, sub:"2025-05-09", apv:null,          note:"Please add an Operations goal to reflect your department." },
  ],
  goals:[
    { id:"g1",  sid:"s1", area:"Revenue",    title:"Annual Sales Revenue",        uom:"numeric_min", tv:10000000, td:null,         w:30, shared:true,  ro:false },
    { id:"g2",  sid:"s1", area:"Operations", title:"Customer TAT Reduction",      uom:"numeric_max", tv:48,       td:null,         w:25, shared:false, ro:false },
    { id:"g3",  sid:"s1", area:"Customer",   title:"CRM System Rollout",          uom:"timeline",    tv:null,     td:"2025-09-30", w:30, shared:false, ro:false },
    { id:"g4",  sid:"s1", area:"Safety",     title:"Safety Incidents (Dept KPI)", uom:"zero",        tv:0,        td:null,         w:15, shared:true,  ro:true  },
    { id:"g5",  sid:"s2", area:"Revenue",    title:"Sales Pipeline Growth",       uom:"numeric_min", tv:5000000,  td:null,         w:35, shared:false, ro:false },
    { id:"g6",  sid:"s2", area:"Customer",   title:"NPS Score Improvement",       uom:"numeric_min", tv:75,       td:null,         w:30, shared:false, ro:false },
    { id:"g7",  sid:"s2", area:"People",     title:"Professional Dev Hours",      uom:"numeric_min", tv:40,       td:null,         w:20, shared:false, ro:false },
    { id:"g8",  sid:"s2", area:"Safety",     title:"Safety Incidents (Dept KPI)", uom:"zero",        tv:0,        td:null,         w:15, shared:true,  ro:true  },
    { id:"g9",  sid:"s3", area:"Revenue",    title:"Regional Revenue Target",     uom:"numeric_min", tv:2000000,  td:null,         w:50, shared:false, ro:false },
    { id:"g10", sid:"s3", area:"Operations", title:"Process Efficiency Score",    uom:"numeric_min", tv:85,       td:null,         w:50, shared:false, ro:false },
  ],
  ach:[
    { id:"a1", gid:"g1", q:"q1", val:7500000, date:null,         st:"on_track",  sc:75  },
    { id:"a2", gid:"g2", q:"q1", val:36,      date:null,         st:"on_track",  sc:100 },
    { id:"a3", gid:"g3", q:"q1", val:null,    date:"2025-09-25", st:"on_track",  sc:100 },
    { id:"a4", gid:"g4", q:"q1", val:0,       date:null,         st:"completed", sc:100 },
    { id:"a5", gid:"g8", q:"q1", val:0,       date:null,         st:"completed", sc:100 },
  ],
  comments:[
    { id:"cc1", sid:"s1", q:"q1", mid:"m1", text:"Great Q1 progress — revenue on track at 75%. TAT is ahead of plan. CRM rollout must stay on schedule, 5 weeks remaining.", date:"2025-07-20" },
  ],
  audit:[
    { id:"al1", type:"goal_sheet", eid:"s1", by:"m1", field:"status → locked", old:"submitted / false", nw:"approved / true",  act:"approve", at:"2025-05-12T10:23:00Z" },
    { id:"al2", type:"goal",       eid:"g1", by:"m1", field:"target_value",    old:"₹8,000,000",         nw:"₹10,000,000",      act:"update",  at:"2025-05-12T10:20:00Z" },
    { id:"al3", type:"goal_sheet", eid:"s1", by:"a1", field:"locked",          old:"true",               nw:"false",             act:"unlock",  at:"2025-05-13T14:05:00Z" },
    { id:"al4", type:"goal_sheet", eid:"s1", by:"m1", field:"status → locked", old:"submitted / false", nw:"approved / true",  act:"approve", at:"2025-05-13T15:30:00Z" },
  ],
  escR:[
    { id:"r1", type:"submission_overdue", label:"Goal Submission Overdue",  days:7,  on:true  },
    { id:"r2", type:"checkin_overdue",    label:"Check-in Not Completed",   days:14, on:true  },
  ],
  escE:[
    { id:"ev1", rid:"r1", uid:"e3", over:12, at:"2025-05-21T09:00:00Z", done:false },
  ],
}
