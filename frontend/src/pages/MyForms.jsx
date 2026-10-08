import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function MyForms() {
  const [forms,setForms]=useState([]); const [loading,setLoading]=useState(true); const [message,setMessage]=useState("");
  const load=async()=>{try{const data=await apiRequest("/forms/mine");setForms(data.forms||[]);}catch(e){setMessage(e.message);}finally{setLoading(false);}};
  useEffect(()=>{load();},[]);
  const toggle=async form=>{try{await apiRequest("/forms/"+form._id,{method:"PUT",body:JSON.stringify({isActive:!form.isActive})});setForms(fs=>fs.map(f=>f._id===form._id?{...f,isActive:!f.isActive}:f));}catch(e){setMessage(e.message);}};
  const remove=async id=>{if(!window.confirm("Delete this feedback form?"))return;try{await apiRequest("/forms/"+id,{method:"DELETE"});setForms(fs=>fs.filter(f=>f._id!==id));}catch(e){setMessage(e.message);}};
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-5xl">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><button onClick={()=>window.location.href="/dashboard"} className="text-sm text-indigo-600">← Dashboard</button><h1 className="mt-2 text-2xl font-bold">My Feedback Forms</h1><p className="mt-1 text-sm text-slate-500">Manage forms you created and control their availability.</p></div><button onClick={()=>window.location.href="/forms/new"} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">+ Create Form</button></div>
    {message&&<p className="mb-4 rounded-xl border bg-white p-3 text-sm text-red-600">{message}</p>}
    {loading?<div className="rounded-2xl bg-white p-6">Loading forms...</div>:forms.length===0?<div className="rounded-2xl bg-white p-8 text-center shadow-sm"><p className="font-semibold">No forms yet</p><p className="mt-1 text-sm text-slate-500">Create your first feedback form to get started.</p></div>:
    <div className="grid gap-4">{forms.map(form=><article key={form._id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-lg font-semibold">{form.title}</h2><span className={"rounded-full px-2 py-1 text-xs font-medium "+(form.isActive?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-600")}>{form.isActive?"Active":"Inactive"}</span></div><p className="mt-1 text-sm text-slate-500">{form.description||"No description"}</p><p className="mt-3 text-xs text-slate-400">{form.questions?.length||0} questions</p></div><div className="flex gap-2"><button onClick={()=>toggle(form)} className="rounded-lg border px-3 py-2 text-sm">{form.isActive?"Deactivate":"Activate"}</button><button onClick={()=>remove(form._id)} className="rounded-lg border px-3 py-2 text-sm text-red-600">Delete</button></div></div></article>)}</div>}
  </div></main>;
}
