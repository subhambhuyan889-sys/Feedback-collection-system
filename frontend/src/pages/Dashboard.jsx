import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import AppShell from "../components/AppShell";

function Stat({ label, value, detail }) {
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.04)]">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-2 text-[28px] font-extrabold tracking-tight text-slate-950">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{detail}</p>
  </article>;
}

export default function Dashboard() {
  const [user,setUser]=useState(null), [data,setData]=useState({totalForms:0,totalResponses:0,averageRating:null,satisfaction:null,byForm:[],recentResponses:[]});
  useEffect(()=>{
    if(!localStorage.getItem("token")){window.location.href="/";return;}
    Promise.all([apiRequest("/auth/me"),apiRequest("/analytics")]).then(([u,a])=>{setUser(u.user);setData(a.analytics||{});}).catch(()=>{localStorage.removeItem("token");window.location.href="/";});
  },[]);
  const forms=data.totalForms||0, responses=data.totalResponses||0, avg=data.averageRating==null?"—":Number(data.averageRating).toFixed(1), satisfaction=data.satisfaction==null?"—":data.satisfaction+"%";
  const byForm=data.byForm||[], max=Math.max(...byForm.map(x=>x.responses||0),1);
  return <AppShell title="Dashboard">
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-semibold text-slate-400">Overview</p><h2 className="mt-1 text-[30px] font-extrabold tracking-[-0.03em]">Good to see you, {user?.name?.split(" ")[0]||"there"}.</h2><p className="mt-1 text-sm text-slate-500">A clear view of your feedback activity and response quality.</p></div>
        <div className="flex gap-2"><button onClick={()=>window.location.href="/forms/new"} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50">Create form</button><button onClick={()=>window.location.href="/feedback"} className="rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800">Give feedback</button></div>
      </div>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active forms" value={forms} detail="Published in your workspace"/>
        <Stat label="Responses" value={responses} detail="Feedback submitted"/>
        <Stat label="Average rating" value={avg} detail={avg==="—"?"No ratings yet":"Out of 5.0"} />
        <Stat label="Satisfaction" value={satisfaction} detail={satisfaction==="—"?"No rating data":"Ratings of 4 or 5"} />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_.85fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.04)] sm:p-6">
          <div className="flex items-start justify-between"><div><h3 className="text-sm font-bold">Response volume</h3><p className="mt-1 text-xs text-slate-400">Responses grouped by active form</p></div><button onClick={()=>window.location.href="/analytics"} className="text-xs font-bold text-slate-700 hover:underline">Open analytics</button></div>
          <div className="mt-7 flex h-56 items-end gap-3">
            {byForm.slice(0,8).map((f,i)=><div key={f.formId||i} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className="flex h-44 w-full items-end rounded-md bg-slate-50 px-1"><div className="w-full rounded-t-md bg-slate-900 transition-all" style={{height:Math.max(8,((f.responses||0)/max)*100)+"%"}}/></div><span className="w-full truncate text-center text-[10px] font-medium text-slate-500">{f.title||"Form"}</span></div>)}
            {!byForm.length&&<div className="grid w-full place-items-center text-sm text-slate-400">No responses yet.</div>}
          </div>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.04)] sm:p-6">
          <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Workspace health</h3><p className="mt-1 text-xs text-slate-400">A quick quality signal</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">Live</span></div>
          <div className="mt-8 text-center"><div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-[10px] border-slate-100"><div><p className="text-2xl font-extrabold">{satisfaction}</p><p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">satisfied</p></div></div></div>
          <div className="mt-7 grid grid-cols-2 gap-2"><button onClick={()=>window.location.href="/forms"} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50">My forms</button><button onClick={()=>window.location.href="/responses"} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50">Responses</button></div>
        </article>
      </section>
      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.04)] sm:p-6">
        <div className="flex items-center justify-between"><div><h3 className="text-sm font-bold">Recent submissions</h3><p className="mt-1 text-xs text-slate-400">Latest activity in this workspace</p></div><button onClick={()=>window.location.href="/responses"} className="text-xs font-bold text-slate-700 hover:underline">View all</button></div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-slate-100 text-slate-400"><tr><th className="pb-3 font-semibold">Form</th><th className="pb-3 font-semibold">Answers</th><th className="pb-3 font-semibold">Submitted</th><th className="pb-3 text-right font-semibold">Status</th></tr></thead><tbody>{(data.recentResponses||[]).slice(0,6).map((r,i)=><tr key={r._id||i} className="border-b border-slate-50 last:border-0"><td className="py-3 font-semibold text-slate-700">{r.form?.title||"Feedback form"}</td><td className="py-3 text-slate-500">{Object.keys(r.answers||{}).length} answers</td><td className="py-3 text-slate-500">{r.createdAt?new Date(r.createdAt).toLocaleDateString():"—"}</td><td className="py-3 text-right"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">Submitted</span></td></tr>)}{!(data.recentResponses||[]).length&&<tr><td colSpan="4" className="py-10 text-center text-slate-400">No submissions yet.</td></tr>}</tbody></table></div>
      </section>
    </div>
  </AppShell>;
}