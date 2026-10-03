import { useEffect,useState } from "react";
import { apiRequest } from "../services/api";

export default function SubmitFeedback(){
 const [forms,setForms]=useState([]),[selected,setSelected]=useState(""),[answers,setAnswers]=useState([]),[message,setMessage]=useState("");
 useEffect(()=>{apiRequest("/forms").then(d=>setForms(d.forms||[])).catch(e=>setMessage(e.message));},[]);
 const choose=id=>{setSelected(id);const f=forms.find(x=>x._id===id);setAnswers((f?.questions||[]).map(()=> ""));setMessage("");};
 const update=(i,v)=>setAnswers(a=>a.map((x,n)=>n===i?v:x));
 const submit=async e=>{e.preventDefault();if(!selected)return setMessage("Select a feedback form.");const f=forms.find(x=>x._id===selected);if(f?.questions.some((q,i)=>q.required&&(answers[i]===undefined||answers[i]==="")))return setMessage("Please answer all required questions.");try{await apiRequest("/feedback",{method:"POST",body:JSON.stringify({formId:selected,answers})});setMessage("Feedback submitted successfully.");setSelected("");setAnswers([]);}catch(err){setMessage(err.message);}};
 return <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8"><form onSubmit={submit} className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm"><button type="button" onClick={()=>window.location.href="/dashboard"} className="mb-4 text-sm text-indigo-600">← Dashboard</button><h1 className="text-2xl font-bold">Submit Feedback</h1>
 <select required className="mt-5 w-full rounded-xl border p-3" value={selected} onChange={e=>choose(e.target.value)}><option value="">Select a feedback form</option>{forms.map(f=><option key={f._id} value={f._id}>{f.title}</option>)}</select>
 {selected&&forms.find(f=>f._id===selected)?.questions.map((q,i)=><div key={q._id||i} className="mt-5"><label className="mb-2 block font-medium">{q.text}{q.required?" *":""}</label>
 {q.type==="rating"?<div className="flex gap-2">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>update(i,n)} className={"rounded-lg border px-4 py-2 "+(answers[i]===n?"bg-indigo-600 text-white":"")}>{n}</button>)}</div>:
 q.type==="long"||q.type==="textarea"?<textarea required={q.required} className="w-full rounded-xl border p-3" rows="4" value={answers[i]||""} onChange={e=>update(i,e.target.value)}/>:
 q.type==="yes-no"?<select required={q.required} className="w-full rounded-xl border p-3" value={answers[i]||""} onChange={e=>update(i,e.target.value)}><option value="">Choose</option><option value="Yes">Yes</option><option value="No">No</option></select>:
 q.type==="multiple-choice"?<select required={q.required} className="w-full rounded-xl border p-3" value={answers[i]||""} onChange={e=>update(i,e.target.value)}><option value="">Choose</option>{(q.options||[]).map(o=><option key={o}>{o}</option>)}</select>:
 <input required={q.required} className="w-full rounded-xl border p-3" value={answers[i]||""} onChange={e=>update(i,e.target.value)}/>}</div>)}
 {message&&<p className="mt-4 text-sm text-indigo-700">{message}</p>}{selected&&<button className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">Submit Feedback</button>}
 </form></main>;
}