import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const studentNav = [
  ["▣", "Dashboard", "/dashboard"],
  ["✎", "Give Feedback", "/feedback"],
  ["▤", "My Feedback", "/responses"],
  ["♙", "My Profile", "/profile"],
  ["♧", "Notifications", "/settings"],
];

const adminNav = [
  ["⌂", "Dashboard", "/admin"],
  ["▤", "Feedbacks", "/responses"],
  ["◒", "Analytics", "/analytics"],
  ["♙", "Manage Users", "/profile"],
  ["⚙", "Settings", "/settings"],
];

export default function AppShell({ children, title = "Student Portal", admin = false }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiRequest("/auth/me").then((d) => setUser(d.user)).catch(() => {});
  }, []);

  const nav = admin ? adminNav : studentNav;
  const active = window.location.pathname;

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-[#f5f7ff] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[235px] shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-[72px] items-center border-b border-slate-100 px-6">
            <button onClick={() => (window.location.href = admin ? "/admin" : "/dashboard")} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">F</span>
              <span className="text-lg font-extrabold tracking-tight text-indigo-700">FeedPro</span>
            </button>
          </div>

          <div className="flex-1 px-3 py-5">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{admin ? "Admin Portal" : "Student Portal"}</p>
            <nav className="space-y-1.5">
              {nav.map(([icon, label, path]) => {
                const isActive = active === path;
                return (
                  <button
                    key={label}
                    onClick={() => (window.location.href = path)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition ${isActive ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`}
                  >
                    <span className="w-5 text-center text-sm">{icon}</span>{label}
                  </button>
                );
              })}
            </nav>
            {!admin && (
              <button onClick={() => (window.location.href = "/forms")} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
                <span className="w-5 text-center">▧</span>My Forms
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 p-4">
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-500 hover:bg-slate-50">
              <span className="w-5 text-center">↪</span>Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[64px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
              <p className="truncate text-sm font-bold text-slate-900">{admin ? "Admin workspace" : "Your feedback workspace"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden h-9 w-9 rounded-full border border-slate-200 bg-white text-sm text-slate-500 sm:block">♧</button>
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                  {(user?.name || "S").charAt(0).toUpperCase()}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="max-w-[130px] truncate text-xs font-bold text-slate-800">{user?.name || "Student"}</p>
                  <p className="text-[10px] text-slate-400">{admin ? "Administrator" : "Student"}</p>
                </div>
                <span className="hidden text-[10px] text-slate-400 sm:block">⌄</span>
              </div>
            </div>
          </header>

          <div className="border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {nav.slice(0, 5).map(([icon, label, path]) => (
                <button key={label} onClick={() => (window.location.href = path)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${active === path ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600"}`}>
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
