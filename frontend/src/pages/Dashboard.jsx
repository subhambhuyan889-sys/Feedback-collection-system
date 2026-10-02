import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const stats = [
  { label: "Forms", value: "0" },
  { label: "Responses", value: "0" },
  { label: "Pending", value: "0" },
  { label: "Avg. Rating", value: "—" },
];

const navItems = ["Dashboard", "My Feedback Forms", "Responses", "Analytics", "Profile", "Settings"];

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    apiRequest("/auth/me", { token })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:block">
          <div className="mb-8">
            <p className="text-sm font-semibold text-indigo-600">Feedback System</p>
            <h2 className="mt-1 text-xl font-bold">Workspace</h2>
          </div>
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <button key={item} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium ${index === 0 ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
                {item}
              </button>
            ))}
          </nav>
          <button onClick={logout} className="mt-8 w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-600">
            Logout
          </button>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-indigo-600">Feedback Collection System</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome{user?.name ? `, ${user.name}` : ""}</h1>
            <p className="mt-2 text-sm text-slate-500">Create forms, collect responses and monitor feedback from one place.</p>
          </header>

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">My Feedback Forms</h2>
                  <p className="mt-1 text-sm text-slate-500">Your created forms and response activity.</p>
                </div>
                <button className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Create Form</button>
              </div>
              <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="font-medium">No forms yet</p>
                <p className="mt-1 text-sm text-slate-500">Create your first feedback form to start collecting responses.</p>
              </div>
            </div>

            <aside className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                {["Create Feedback Form", "View Responses", "Open Analytics"].map((item) => (
                  <button key={item} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50">
                    {item}
                  </button>
                ))}
              </div>
            </aside>
          </section>
        </section>
      </div>
    </main>
  );
}
