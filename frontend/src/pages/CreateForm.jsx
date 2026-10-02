import { useState } from "react";
import { apiRequest } from "../services/api";

const types = [
  ["rating","Rating (1–5)"],
  ["short","Short Answer"],
  ["long","Long Answer"],
  ["multiple-choice","Multiple Choice"],
  ["yes-no","Yes / No"],
];

export default function CreateForm() {
  const [title,setTitle]=useState(""); const [description,setDescription]=useState("");
  const [questions,setQuestions]=useState([{text:"",type:"rating",required:true,options:[]}]); const [message,setMessage]=useState("");
  const update=(i,p)=>setQuestions(q=>q.map((x,n)=>n===i?{...x,...p}:x));
  const add=()=>setQuestions(q=>[...q,{text:"",type:"short",required:false,options:[]}]);
  const remove=i=>setQuestions(q=>q.filter((_,n)=>n!==i));
  const submit=async e=>{e.preventDefault();setMessage("");
    try{await apiRequest("/forms",{method:"POST",body:JSON.stringify({title,description,questions})});setMessage("Feedback form created successfully.");setTitle("");setDescription("");setQuestions([{text:"",type:"rating",required:true,options:[]}]);}
    catch(err){setMessage(err.message);}
  };
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
    <button type="button" onClick={()=>window.location.href="/dashboard"} className="mb-4 text-sm text-indigo-600">← Dashboard</button>
    <h1 className="text-2xl font-bold">Create Feedback Form</h1><p className="mt-1 text-sm text-slate-500">Build a form and start collecting responses.</p>
    <form onSubmit={submit} className="mt-6 space-y-5">
      <input className="w-full rounded-xl border p-3" placeholder="Form title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea className="w-full rounded-xl border p-3" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} rows="3"/>
      {questions.map((q,i)=><div key={i} className="rounded-xl border p-4">
        <div className="flex gap-2"><input className="flex-1 rounded-lg border p-3" placeholder={"Question "+(i+1)} value={q.text} onChange={e=>update(i,{text:e.target.value})} required/>{questions.length>1&&<button type="button" onClick={()=>remove(i)} className="rounded-lg border px-3 text-red-600">Remove</button>}</div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row"><select className="rounded-lg border p-3" value={q.type} onChange={e=>update(i,{type:e.target.value})}>{types.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={q.required} onChange={e=>update(i,{required:e.target.checked})}/> Required</label></div>
        {q.type==="multiple-choice"&&<input className="mt-3 w-full rounded-lg border p-3" placeholder="Options separated by commas" value={q.options.join(", ")} onChange={e=>update(i,{options:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/>}
      </div>)}
      <button type="button" onClick={add} className="rounded-xl border px-4 py-2 font-medium">+ Add Question</button>
      {message&&<p className="text-sm text-indigo-700">{message}</p>}
      <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">Create Form</button>
    </form>
  </div></main>;
}