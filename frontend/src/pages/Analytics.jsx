import { useEffect,useMemo,useState } from "react";
import { apiRequest } from "../services/api";
export default function Analytics(){
 const [responses,setResponses]=useState([]),[forms,setForms]=useState([]),[error,setError]=useState("");
 useEffect(()=>{Promise.all([apiRequest("/forms",{token:localStorage.getItem("token")}),apiRequest("/feedback",{token:localStorage.getItem("token")})]).then(([a,b])=>{setForms(a.forms||[]);setResponses(b.responses||[])}).catch(e=>setError(e.message));},[]);
 const ratings=useMemo(()=>responses.flatMap(r=>Object.values(r.answers||{}).filter(v=>typeof v==="number"&&v>=1&&v<=5)),[responses]);
 const avg=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1):"—";
 const distribution=[1,2,3,4,5].map(n=>({n,count:ratings.filter(x=>x===n).length})); const max=Math.max(1,...distribution.map(x=>x.count));
 return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-6xl"><h1 className="text-3xl font-bold">Analytics</h1><p className="mt-1 text-sm text-slate-500">Response activity and rating trends.</p>{error&&<p className="mt-4 text-red-600">{error}</p>}
 <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Forms",forms.length],["Responses",responses.length],["Average Rating",avg],["Satisfaction",ratings.length?Math.round(ratings.filter(x=>x>=4).length/ratings.length*100)+"%":"—"]].map(([l,v])=><div key={l} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{l}</p><p className="mt-2 text-3xl font-bold">{v}</p></div>)}</div>
 <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Rating Distribution</h2><div className="mt-6 flex h-56 items-end gap-4">{distribution.map(x=><div key={x.n} className="flex flex-1 flex-col items-center gap-2"><span className="text-xs text-slate-500">{x.count}</span><div className="w-full max-w-14 rounded-t-lg bg-indigo-500" style={{height:`${Math.max(8,x.count/max*180)}px`}}/><span className="text-sm font-medium">{x.n}</span></div>)}</div></section>
 <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold">Responses by Form</h2><div className="mt-4 space-y-3">{forms.map(f=><div key={f._id} className="flex items-center justify-between rounded-xl border p-4"><span className="font-medium">{f.title}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{responses.filter(r=>r.form?._id===f._id).length} responses</span></div>)}</div></section>
 </div></main>;
}