import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const nav = [
  ["Dashboard", "/dashboard"],
  ["My Forms", "/forms"],
  ["Submit Feedback", "/feedback"],
  ["Responses", "/responses"],
  ["Analytics", "/analytics"],
  ["Profile", "/profile"],
  ["Settings", "/settings"],
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ forms: 0, responses: 0, avg: "—" });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
      return;
    }

    Promise.all([apiRequest("/auth/me"), apiRequest("/analytics")])
      .then(([u, a]) => {
        setUser(u.user);
        const x = a.analytics || {};
        setStats({
          forms: x.totalForms || 0,
          responses: x.totalResponses || 0,
          avg: x.averageRating ?? "—",
        });
      })
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
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-5 lg:block">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                F
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-600">Feedback</p>
                <h2 className="text-base font-bold">Workspace</h2>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {nav.map(([label, path], i) => (
              <button
                key={label}
                onClick={() => (window.location.href = path)}
                className={
                  "w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition " +
                  (i === 0
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                }
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-8 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 sm:text-sm">
                    Feedback Collection System
                  </p>
                  <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Welcome{user?.name ? `, ${user.name}` : ""}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                    Create forms, collect responses and monitor feedback from one place.
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 lg:hidden"
                >
                  Logout
                </button>
              </div>
            </header>

            <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {nav.slice(1, 5).map(([label, path]) => (
                <button
                  key={label}
                  onClick={() => (window.location.href = path)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm"
                >
                  {label}
                </button>
              ))}
            </nav>

            <section className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                ["Forms", stats.forms],
                ["Responses", stats.responses],
                ["Avg. Rating", stats.avg],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
                  <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    {value}
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Quick Actions</h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Jump straight to the tools you use most.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["Manage My Forms", "/forms"],
                  ["Submit Feedback", "/feedback"],
                  ["View Analytics", "/analytics"],
                ].map(([label, path]) => (
                  <button
                    key={label}
                    onClick={() => (window.location.href = path)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left text-sm font-semibold text-slate-800 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    {label}
                    <span className="ml-2 text-slate-400">→</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
