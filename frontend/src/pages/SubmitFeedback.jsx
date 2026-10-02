import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function SubmitFeedback() {
  const [forms, setForms] = useState([]);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiRequest("/forms", { token: localStorage.getItem("token") })
      .then(data => setForms(data.forms || []))
      .catch(err => setMessage(err.message));
  }, []);

  const choose = (id) => {
    setSelected(id);
    const form = forms.find(f => f._id === id);
    setAnswers((form?.questions || []).map(() => ""));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Submit Feedback</h1>
        <select className="mt-5 w-full rounded-xl border p-3" value={selected} onChange={e => choose(e.target.value)}>
          <option value="">Select a feedback form</option>
          {forms.map(form => <option key={form._id} value={form._id}>{form.title}</option>)}
        </select>
        {selected && forms.find(f => f._id === selected)?.questions.map((q, i) => (
          <div key={i} className="mt-5">
            <label className="mb-2 block font-medium">{q.text}{q.required ? " *" : ""}</label>
            {q.type === "long" ? (
              <textarea className="w-full rounded-xl border p-3" rows="4" value={answers[i]} onChange={e => setAnswers(a => a.map((v, x) => x === i ? e.target.value : v))} />
            ) : q.type === "yes-no" ? (
              <select className="w-full rounded-xl border p-3" value={answers[i]} onChange={e => setAnswers(a => a.map((v, x) => x === i ? e.target.value : v))}><option value="">Choose</option><option>Yes</option><option>No</option></select>
            ) : q.type === "rating" ? (
              <div className="flex gap-2">{[1,2,3,4,5].map(n => <button type="button" key={n} onClick={() => setAnswers(a => a.map((v, x) => x === i ? n : v))} className={`rounded-lg border px-4 py-2 ${answers[i] === n ? "bg-indigo-600 text-white" : ""}`}>{n}</button>)}</div>
            ) : (
              <input className="w-full rounded-xl border p-3" value={answers[i]} onChange={e => setAnswers(a => a.map((v, x) => x === i ? e.target.value : v))} />
            )}
          </div>
        ))}
        {message && <p className="mt-4 text-sm text-indigo-700">{message}</p>}
      </div>
    </main>
  );
}
