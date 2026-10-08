import { useState } from "react";
import { apiRequest } from "../services/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <h1 className="text-3xl font-bold">Login</h1>

          <input
            className="w-full border rounded p-3"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="w-full border rounded p-3"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && <p className="text-red-600">{error}</p>}

          <button className="w-full rounded p-3 bg-black text-white" type="submit">
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          <span>OR</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={continueWithGoogle}
          className="w-full rounded p-3 border border-gray-300 bg-white text-gray-900 font-medium hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a className="font-semibold text-black underline" href="/signup">
            Create account
          </a>
        </p>
      </div>
    </main>
  );
}
