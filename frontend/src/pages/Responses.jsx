import { useEffect,useState } from "react";
import { apiRequest } from "../services/api";
import AppShell from "../components/AppShell";

export default function Responses(){
 const [responses,setResponses]=useState([]),[query,setQuery]=useState(""),[error,setError]=useState("");
 useEffect(()=>{apiRequest("/feedback").then(d=>setResponses(d.responses||[])).catch(e=>setError(e.message))},[]);
 const filtered=responses.filter(r=>(r.form?.title||"").toLowerCase().includes(query.toLowerCase()));
 return <AppShell title="My Feedback"><div className="mx-auto max-w-7xl">
  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-slate-400">Feedback history</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">My Feedback</h1><p className="mt-1 text-sm text-slate-500">Review feedback submitted across your forms.</p></div><input className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 sm:w-64" placeholder="Search feedback..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
  {error&&<div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-slate-50 text-slate-400"><tr><th className="px-5 py-3 font-semibold">Form</th><th className="px-5 py-3 font-semibold">Submitted</th><th className="px-5 py-3 font-semibold">Answers</th><th className="px-5 py-3 text-right font-semibold">Status</th></tr></thead><tbody>{filtered.map(r=><tr key={r._id} className="border-t border-slate-100"><td className="px-5 py-4 font-bold text-slate-700">{r.form?.title||"Feedback Form"}</td><td className="px-5 py-4 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td><td className="max-w-xs px-5 py-4 text-slate-500">{Object.keys(r.answers||{}).length} responses</td><td className="px-5 py-4 text-right"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Submitted</span></td></tr>)}{!filtered.length&&<tr><td colSpan="4" className="py-12 text-center text-slate-400">No feedback found.</td></tr>}</tbody></table></div></div>
 </div></AppShell>;
}