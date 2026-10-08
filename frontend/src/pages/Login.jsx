import { useState } from "react";
import { apiRequest } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://feedback-collection-backend.onrender.com/api";

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

  const continueWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section className="hidden lg:block text-white">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            FeedbackHub • Secure feedback workspace
          </div>
          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight">
            Turn every response into a better experience.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">
            Collect feedback, understand responses, and keep your team connected from one clean workspace.
          </p>
          <div className="mt-8 flex gap-3 text-sm text-slate-300">
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Smart forms</span>
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Live analytics</span>
            <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Team ready</span>
          </div>
        </section>

        <section className="w-full max-w-md justify-self-center">
          <div className="rounded-3xl border border-white/60 bg-white/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-bold text-white shadow-lg">F</div>
                <div>
                  <p className="font-bold text-slate-950">FeedbackHub</p>
                  <p className="text-xs text-slate-500">Feedback Collection System</p>
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-500">Sign in to continue to your workspace.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email</span>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Password</span>
                <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/10" type="password" placeholder="Enter your password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              <button className="w-full rounded-xl bg-slate-950 px-4 py-3.5 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0" type="submit">Sign in</button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /><span>or continue with</span><span className="h-px flex-1 bg-slate-200" />
            </div>

            <button type="button" onClick={continueWithGoogle} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-sm font-bold">G</span>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <a className="font-bold text-slate-950 hover:underline" href="/signup">Create account</a>
            </p>
          </div>
          <p className="mt-5 text-center text-xs text-slate-500">Secure access • Built for teams</p>
        </section>
      </div>
    </main>
  );
}
