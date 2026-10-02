import { useEffect,useState } from "react";
import { apiRequest } from "../services/api";
export default function Analytics(){
 const [data,setData]=useState(null),[error,setError]=useState("");
 useEffect(()=>{apiRequest("/analytics").then(r=>setData(r.analytics)).catch(e=>setError(e.message));},[]);
 if(error)return <main className="min-h-screen p-8"><p className="text-red-600">{error}</p></main>;
 const a=data||{totalForms:0,totalResponses:0,averageRating:null,satisfaction:null,byForm:[]};
 return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-6xl"><button onClick={()=>window.location.href="/dashboard"} className="mb-4 text-sm text-indigo-600">← Dashboard</button><h1 className="text-3xl font-bold">Analytics</h1><p className="mt-1 text-sm text-slate-500">Live response activity and rating insights.</p>
 <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Forms",a.totalForms],["Responses",a.totalResponses],["Average Rating",a.averageRating??"—"],["Satisfaction",a.satisfaction==null?"—":a.satisfaction+"%"]].map(([l,v])=><div key={l} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{l}</p><p className="mt-2 text-3xl font-bold">{v}</p></div>)}</div>
 <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Responses by Form</h2><div className="mt-4 space-y-3">{a.byForm?.map(f=><div key={f.formId} className="flex items-center justify-between rounded-xl border p-4"><span className="font-medium">{f.title}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{f.responses} responses</span></div>)}{!a.byForm?.length&&<p className="text-slate-500">No form data yet.</p>}</div></section>
 </div></main>;
}