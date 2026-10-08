import { useState } from "react";
import { apiRequest } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <input className="w-full border rounded p-3" placeholder="Full name" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full border rounded p-3" type="email" placeholder="Email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded p-3" type="password" minLength="8" placeholder="Password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600">{error}</p>}
        <button className="w-full rounded p-3 bg-black text-white" type="submit">Sign up</button>
      </form>
    </main>
  );
}
