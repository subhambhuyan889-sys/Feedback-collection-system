import { useEffect,useState } from "react";
import { apiRequest } from "../services/api";
import AppShell from "../components/AppShell";

export default function SubmitFeedback(){
 const [forms,setForms]=useState([]),[selected,setSelected]=useState(""),[answers,setAnswers]=useState([]),[message,setMessage]=useState("");
 useEffect(()=>{apiRequest("/forms").then(d=>setForms(d.forms||[])).catch(e=>setMessage(e.message))},[]);
 const choose=id=>{setSelected(id);const f=forms.find(x=>x._id===id);setAnswers((f?.questions||[]).map(()=> ""));setMessage("")};
 const update=(i,v)=>setAnswers(a=>a.map((x,n)=>n===i?v:x));
 const submit=async e=>{e.preventDefault();if(!selected)return setMessage("Select a feedback form.");const f=forms.find(x=>x._id===selected);if(f?.questions.some((q,i)=>q.required&&(answers[i]===undefined||answers[i]==="")))return setMessage("Please answer all required questions.");try{await apiRequest("/feedback",{method:"POST",body:JSON.stringify({formId:selected,answers})});setMessage("Feedback submitted successfully.");setSelected("");setAnswers([])}catch(err){setMessage(err.message)}};
 const form=forms.find(f=>f._id===selected);
 return <AppShell title="Give Feedback"><div className="mx-auto max-w-4xl">
  <div className="mb-6"><p className="text-sm font-semibold text-slate-400">Feedback</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Give Feedback</h1><p className="mt-1 text-sm text-slate-500">Your opinion helps us improve.</p></div>
  <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
   <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5"><div><h2 className="font-extrabold">Feedback Form</h2><p className="mt-1 text-xs text-slate-400">Please provide honest feedback for better improvement.</p></div><span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">Step {selected?"2":"1"} of 2</span></div>
   <div className="mt-5"><label className="mb-2 block text-xs font-bold text-slate-700">Select Form <span className="text-rose-500">*</span></label><select required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500" value={selected} onChange={e=>choose(e.target.value)}><option value="">Choose a feedback form</option>{forms.map(f=><option key={f._id} value={f._id}>{f.title}</option>)}</select></div>
   {form&&<div className="mt-6 space-y-6">{form.questions.map((q,i)=><div key={q._id||i} className="border-b border-slate-100 pb-6 last:border-0"><label className="mb-3 block text-sm font-bold text-slate-800">{i+1}. {q.text}{q.required&&<span className="text-rose-500"> *</span>}</label>
    {q.type==="rating"?<div className="flex flex-wrap gap-2">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>update(i,n)} className={"h-10 w-10 rounded-xl border text-sm font-bold transition "+(answers[i]===n?"border-amber-400 bg-amber-50 text-amber-600":"border-slate-200 text-slate-500 hover:border-amber-300")}>★</button>)}</div>:
    q.type==="long"||q.type==="textarea"?<textarea required={q.required} className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Write your valuable feedback here..." value={answers[i]||""} onChange={e=>update(i,e.target.value)}/>:
    q.type==="yes-no"?<div className="flex gap-3">{["Yes","No"].map(v=><button type="button" key={v} onClick={()=>update(i,v)} className={"rounded-xl border px-5 py-2.5 text-sm font-semibold "+(answers[i]===v?"border-indigo-600 bg-indigo-50 text-indigo-700":"border-slate-200 text-slate-600")}>{v}</button>)}</div>:
    q.type==="multiple-choice"?<select required={q.required} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" value={answers[i]||""} onChange={e=>update(i,e.target.value)}><option value="">Choose an option</option>{(q.options||[]).map(o=><option key={o}>{o}</option>)}</select>:
    <input required={q.required} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500" placeholder="Type your answer..." value={answers[i]||""} onChange={e=>update(i,e.target.value)}/>}</div>)}</div>}
   {message&&<div className={"mt-5 rounded-xl p-3 text-sm "+(message.includes("successfully")?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700")}>{message}</div>}
   {selected&&<div className="mt-5 flex justify-end"><button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100">Submit Feedback →</button></div>}
  </form>
 </div></AppShell>;
}