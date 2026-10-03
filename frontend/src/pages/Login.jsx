import { useState } from "react";
import { apiRequest } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const data = await apiRequest("/auth/login", {
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
        <h1 className="text-3xl font-bold">Login</h1>
        <input className="w-full border rounded p-3" type="email" placeholder="Email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded p-3" type="password" placeholder="Password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600">{error}</p>}
        <button className="w-full rounded p-3 bg-black text-white" type="submit">Login</button>
      </form>
    </main>
  );
}
