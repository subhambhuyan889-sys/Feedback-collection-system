import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import AppShell from "../components/AppShell";

const colors = ["from-indigo-500 to-blue-500","from-rose-400 to-pink-500","from-emerald-400 to-teal-500","from-amber-400 to-orange-500"];

export default function Dashboard() {
  const [user,setUser]=useState(null);
  const [data,setData]=useState({totalForms:0,totalResponses:0,averageRating:null,satisfaction:null,byForm:[],recentResponses:[]});

  useEffect(()=>{
    if(!localStorage.getItem("token")){window.location.href="/";return;}
    Promise.all([apiRequest("/auth/me"),apiRequest("/analytics")])
      .then(([u,a])=>{setUser(u.user);setData(a.analytics||{});})
      .catch(()=>{localStorage.removeItem("token");window.location.href="/";});
  },[]);

  const forms=data.totalForms||0, responses=data.totalResponses||0;
  const avg=data.averageRating==null?"—":Number(data.averageRating).toFixed(1);
  const satisfaction=data.satisfaction==null?"—":data.satisfaction+"%";
  const byForm=data.byForm||[];
  const max=Math.max(...byForm.map(x=>x.responses||0),1);

  return <AppShell title="Student Portal">
    <div className="mx-auto max-w-7xl">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-slate-400">Overview</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Hello, {user?.name||"Student"} 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Your feedback helps improve the learning experience.</p>
        </div>
        <button onClick={()=>window.location.href="/feedback"} className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5">Give Feedback <span className="ml-2">→</span></button>
      </div>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 p-5 text-white shadow-xl shadow-indigo-100 sm:p-7">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">FeedPro</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">Share your feedback. Make a difference.</h2>
          <p className="mt-2 max-w-lg text-sm leading-6 text-white/80">Tell us what is working, what can improve, and help your institution create a better experience.</p>
          <button onClick={()=>window.location.href="/feedback"} className="mt-4 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-indigo-700 shadow-sm">Give Feedback →</button>
        </div>
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"/><div className="absolute bottom-[-70px] right-20 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl"/>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["▣","Total Feedback",responses],
          ["◷","Pending Feedback",Math.max(forms-responses,0)],
          ["✓","Completed",responses],
          ["★","Average Rating",avg],
        ].map(([icon,label,value],i)=><article key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className={"grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br "+colors[i]+" text-sm font-bold text-white"}>{icon}</div>
          <p className="mt-3 text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
        </article>)}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-extrabold text-slate-950">Feedback Activity</h2><p className="mt-1 text-xs text-slate-500">Responses collected by form</p></div><button onClick={()=>window.location.href="/analytics"} className="text-xs font-bold text-indigo-600">View analytics →</button></div>
          <div className="mt-7 flex h-48 items-end gap-2 sm:gap-4">
            {byForm.slice(0,8).map((f,i)=><div key={f.formId||i} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-36 w-full items-end justify-center rounded-lg bg-slate-50"><div className={"w-[58%] rounded-t-lg bg-gradient-to-t "+colors[i%colors.length]} style={{height:Math.max(8,((f.responses||0)/max)*100)+"%"}}/></div>
              <span className="w-full truncate text-center text-[10px] font-semibold text-slate-500">{f.title||"Form"}</span>
            </div>)}
            {!byForm.length&&<div className="grid w-full place-items-center text-sm text-slate-400">No feedback activity yet.</div>}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-extrabold text-slate-950">Quick Insights</h2><p className="mt-1 text-xs text-slate-500">Your current feedback health</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Live</span></div>
          <div className="mt-5 space-y-4">
            <div><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-600">Satisfaction</span><b>{satisfaction}</b></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{width:satisfaction==="—"?"0%":satisfaction}}/></div></div>
            <div className="rounded-xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">Ready to collect more?</p><p className="mt-1 text-xs leading-5 text-indigo-600/80">Create a feedback form and start collecting responses from your team.</p><button onClick={()=>window.location.href="/forms/new"} className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white">Create Form</button></div>
          </div>
        </article>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between"><div><h2 className="font-extrabold text-slate-950">Recent Feedback</h2><p className="mt-1 text-xs text-slate-500">Latest responses from your workspace</p></div><button onClick={()=>window.location.href="/responses"} className="text-xs font-bold text-indigo-600">View all →</button></div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[600px] text-left text-xs"><thead className="border-b border-slate-100 text-slate-400"><tr><th className="pb-3 font-semibold">Form</th><th className="pb-3 font-semibold">Rating</th><th className="pb-3 font-semibold">Date</th><th className="pb-3 text-right font-semibold">Status</th></tr></thead>
        <tbody>{(data.recentResponses||[]).slice(0,5).map((r,i)=><tr key={r._id||i} className="border-b border-slate-50 last:border-0"><td className="py-3 font-bold text-slate-700">{r.form?.title||"Feedback Form"}</td><td className="py-3 text-amber-500">★★★★★</td><td className="py-3 text-slate-500">{r.createdAt?new Date(r.createdAt).toLocaleDateString():"—"}</td><td className="py-3 text-right"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Submitted</span></td></tr>)}{!(data.recentResponses||[]).length&&<tr><td colSpan="4" className="py-10 text-center text-slate-400">No responses yet.</td></tr>}</tbody></table></div>
      </section>
    </div>
  </AppShell>;
}