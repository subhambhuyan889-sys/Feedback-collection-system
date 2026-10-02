import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function Responses() {
  const [responses,setResponses]=useState([]),[query,setQuery]=useState(""),[error,setError]=useState("");
  useEffect(()=>{apiRequest("/feedback",{token:localStorage.getItem("token")}).then(d=>setResponses(d.responses||[])).catch(e=>setError(e.message));},[]);
  const filtered=responses.filter(r=>(r.form?.title||"").toLowerCase().includes(query.toLowerCase()));
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold">Responses</h1><p className="text-sm text-slate-500">Review submitted feedback.</p></div><input className="rounded-xl border p-3" placeholder="Search forms..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
    {error&&<p className="mt-4 text-sm text-red-600">{error}</p>}
    <div className="mt-6 space-y-3">{filtered.map(r=><article key={r._id} className="rounded-xl border p-4"><div className="flex justify-between gap-3"><h2 className="font-semibold">{r.form?.title||"Feedback Form"}</h2><span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</span></div><pre className="mt-3 overflow-auto rounded-lg bg-slate-50 p-3 text-xs">{JSON.stringify(r.answers,null,2)}</pre></article>)}{!filtered.length&&<p className="py-10 text-center text-slate-500">No responses found.</p>}</div>
  </div></main>;
}