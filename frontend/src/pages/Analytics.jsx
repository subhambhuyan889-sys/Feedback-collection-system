import { useEffect,useState } from "react";
import { apiRequest } from "../services/api";
import AppShell from "../components/AppShell";

export default function Analytics(){
 const [data,setData]=useState(null),[error,setError]=useState("");
 useEffect(()=>{apiRequest("/analytics").then(r=>setData(r.analytics)).catch(e=>setError(e.message))},[]);
 const a=data||{totalForms:0,totalResponses:0,averageRating:null,satisfaction:null,byForm:[]};
 const max=Math.max(...(a.byForm||[]).map(x=>x.responses||0),1);
 return <AppShell title="Analytics"><div className="mx-auto max-w-7xl">
  <div className="mb-6"><p className="text-sm font-semibold text-slate-400">Performance</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Analytics</h1><p className="mt-1 text-sm text-slate-500">Understand response volume, ratings and satisfaction.</p></div>
  {error&&<div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["Total Forms",a.totalForms],["Total Responses",a.totalResponses],["Average Rating",a.averageRating??"—"],["Satisfaction",a.satisfaction==null?"—":a.satisfaction+"%"]].map(([l,v],i)=><article key={l} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-semibold text-slate-500">{l}</p><p className="mt-2 text-2xl font-extrabold">{v}</p><p className="mt-1 text-[10px] text-emerald-600">Live data</p></article>)}</div>
  <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
   <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"><h2 className="font-extrabold">Responses by Form</h2><div className="mt-6 space-y-5">{(a.byForm||[]).map((f,i)=><div key={f.formId||i}><div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-slate-700">{f.title}</span><b>{f.responses}</b></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={"h-full rounded-full bg-gradient-to-r "+colors[i%4]} style={{width:Math.max(4,(f.responses/max)*100)+"%"}}/></div></div>)}{!(a.byForm||[]).length&&<p className="py-10 text-center text-sm text-slate-400">No form data yet.</p>}</div></section>
   <section className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"><h2 className="font-extrabold">Satisfaction</h2><div className="mx-auto mt-7 grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-indigo-100 via-white to-violet-100 shadow-inner"><div className="grid h-28 w-28 place-items-center rounded-full bg-white shadow-sm"><div className="text-center"><p className="text-2xl font-extrabold">{a.satisfaction==null?"—":a.satisfaction+"%"}</p><p className="text-[10px] text-slate-400">Satisfied</p></div></div></div><p className="mt-6 text-center text-xs leading-5 text-slate-500">Calculated from ratings of 4 or 5 out of 5.</p></section>
  </div>
 </div></AppShell>;
}
const colors=["from-indigo-500 to-blue-500","from-violet-500 to-fuchsia-500","from-emerald-400 to-teal-500","from-amber-400 to-orange-500"];