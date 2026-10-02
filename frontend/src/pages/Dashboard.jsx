import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const nav=[["Dashboard","/dashboard"],["My Feedback Forms","/forms/new"],["Submit Feedback","/feedback"],["Responses","/responses"],["Analytics","/analytics"],["Profile","/profile"],["Settings","/settings"]];

export default function Dashboard(){
 const [user,setUser]=useState(null); const [stats,setStats]=useState({forms:0,responses:0,avg:"—"});
 useEffect(()=>{if(!localStorage.getItem("token")){window.location.href="/";return;} Promise.all([apiRequest("/auth/me"),apiRequest("/analytics")]).then(([u,a])=>{setUser(u.user);const x=a.analytics||{};setStats({forms:x.totalForms||0,responses:x.totalResponses||0,avg:x.averageRating??"—"});}).catch(()=>{localStorage.removeItem("token");window.location.href="/";});},[]);
 const logout=()=>{localStorage.removeItem("token");window.location.href="/";};
 return <main className="min-h-screen bg-slate-50 text-slate-900"><div className="mx-auto flex min-h-screen max-w-7xl">
  <aside className="hidden w-64 shrink-0 border-r bg-white p-5 lg:block"><div className="mb-8"><p className="text-sm font-semibold text-indigo-600">Feedback System</p><h2 className="text-xl font-bold">Workspace</h2></div><nav className="space-y-1">{nav.map(([label,path],i)=><button key={label} onClick={()=>window.location.href=path} className={"w-full rounded-xl px-4 py-3 text-left text-sm font-medium "+(i===0?"bg-indigo-50 text-indigo-700":"text-slate-600 hover:bg-slate-50")}>{label}</button>)}</nav><button onClick={logout} className="mt-8 w-full rounded-xl border px-4 py-3 text-left text-sm">Logout</button></aside>
  <section className="flex-1 p-4 sm:p-6 lg:p-8"><header className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm font-medium text-indigo-600">Feedback Collection System</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome{user?.name ? ", "+user.name : ""}</h1><p className="mt-2 text-sm text-slate-500">Create forms, collect responses and monitor feedback from one place.</p></header>
   <section className="mt-6 grid gap-4 sm:grid-cols-3">{[["Forms",stats.forms],["Responses",stats.responses],["Avg. Rating",stats.avg]].map(([l,v])=><article key={l} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{l}</p><p className="mt-2 text-3xl font-bold">{v}</p></article>)}</section>
   <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Quick Actions</h2><div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Create Feedback Form","/forms/new"],["Submit Feedback","/feedback"],["View Analytics","/analytics"]].map(([l,p])=><button key={l} onClick={()=>window.location.href=p} className="rounded-xl border px-4 py-3 text-left font-medium hover:bg-indigo-50">{l}</button>)}</div></section>
  </section></div></main>;
}