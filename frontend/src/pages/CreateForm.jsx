import { useState } from "react";
import { apiRequest } from "../services/api";

const types = ["rating", "short", "long", "multiple-choice", "yes-no"];

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ text: "", type: "rating", required: true, options: [] }]);
  const [message, setMessage] = useState("");

  const addQuestion = () => setQuestions([...questions, { text: "", type: "short", required: false, options: [] }]);
  const updateQuestion = (index, patch) => setQuestions(questions.map((q, i) => i === index ? { ...q, ...patch } : q));
  const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await apiRequest("/forms", {
        method: "POST",
        token: localStorage.getItem("token"),
        body: JSON.stringify({ title, description, questions }),
      });
      setMessage("Feedback form created successfully.");
      setTitle("");
      setDescription("");
      setQuestions([{ text: "", type: "rating", required: true, options: [] }]);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Create Feedback Form</h1>
          <p className="mt-1 text-sm text-slate-500">Build a form and start collecting responses.</p>
          <form onSubmit={submit} className="mt-6 space-y-5">
            <input className="w-full rounded-xl border p-3" placeholder="Form title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea className="w-full rounded-xl border p-3" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows="3" />
            {questions.map((q, i) => (
              <div key={i} className="rounded-xl border p-4">
                <div className="flex gap-2">
                  <input className="flex-1 rounded-lg border p-3" placeholder={`Question ${i + 1}`} value={q.text} onChange={e => updateQuestion(i, { text: e.target.value })} required />
                  {questions.length > 1 && <button type="button" onClick={() => removeQuestion(i)} className="rounded-lg border px-3 text-red-600">Remove</button>}
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <select className="rounded-lg border p-3" value={q.type} onChange={e => updateQuestion(i, { type: e.target.value })}>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={q.required} onChange={e => updateQuestion(i, { required: e.target.checked })} /> Required</label>
                </div>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="rounded-xl border px-4 py-2 font-medium">+ Add Question</button>
            {message && <p className="text-sm text-indigo-700">{message}</p>}
            <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">Create Form</button>
          </form>
        </div>
      </div>
    </main>
  );
}
