import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const studentNav = [
  ["grid", "Dashboard", "/dashboard"],
  ["message", "Give Feedback", "/feedback"],
  ["list", "My Feedback", "/responses"],
  ["forms", "My Forms", "/forms"],
  ["user", "Profile", "/profile"],
  ["settings", "Settings", "/settings"],
];

const adminNav = [
  ["grid", "Overview", "/admin"],
  ["message", "Feedbacks", "/responses"],
  ["chart", "Analytics", "/analytics"],
  ["forms", "Forms", "/forms"],
  ["user", "Profile", "/profile"],
  ["settings", "Settings", "/settings"],
];

function Icon({ name, size = 17 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.2 8.2 0 0 1-3.1-.6L4 20l1.6-4.2A7.4 7.4 0 0 1 4.5 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>,
    forms: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></>,
    user: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
    settings: <><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.5v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.5h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.5v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.6 1Z"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-6"/></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8Z"/><path d="M10 21h4"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 4h5v16h-5"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function AppShell({ children, title = "Workspace", admin = false }) {
  const [user, setUser] = useState(null);
  useEffect(() => { apiRequest("/auth/me").then(d => setUser(d.user)).catch(() => {}); }, []);

  // Keep the admin navigation consistent across every route, not just /admin.
  const isAdmin = admin || user?.role === "admin";
  const nav = isAdmin ? adminNav : studentNav;
  const active = window.location.pathname;
  const logout = () => { localStorage.removeItem("token"); window.location.href = "/"; };

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 border-r border-slate-200 bg-[#fbfbfc] lg:flex lg:flex-col">
          <div className="flex h-[76px] items-center border-b border-slate-200/80 px-6">
            <button onClick={() => window.location.href = isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm"><span className="text-sm font-black">F</span></span>
              <span className="text-[17px] font-extrabold tracking-[-0.02em]">FeedPro</span>
            </button>
          </div>
          <div className="flex-1 px-3 py-6">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{isAdmin ? "Administration" : "Workspace"}</p>
            <nav className="space-y-1">
              {nav.map(([icon, label, path]) => {
                const isActive = active === path;
                return <button key={label} onClick={() => window.location.href = path}
                  className={"group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-semibold transition " +
                    (isActive ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950")}>
                  <Icon name={icon} size={16}/><span>{label}</span>
                </button>;
              })}
            </nav>
          </div>
          <div className="border-t border-slate-200/80 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-white p-2.5 ring-1 ring-slate-200">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white">{(user?.name || "U").charAt(0).toUpperCase()}</div>
              <div className="min-w-0"><p className="truncate text-xs font-bold">{user?.name || "User"}</p><p className="truncate text-[10px] text-slate-400">{user?.email || "Account"}</p></div>
            </div>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[12px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Icon name="logout" size={15}/>Sign out</button>
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-9">
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{isAdmin ? "Admin workspace" : "Feedback workspace"}</p><h1 className="truncate text-[14px] font-bold text-slate-900">{title}</h1></div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.location.href="/settings"} aria-label="Settings" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"><Icon name="bell" size={16}/></button>
              <button onClick={() => window.location.href="/profile"} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 hover:bg-slate-50">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">{(user?.name || "U").charAt(0).toUpperCase()}</span>
                <span className="hidden max-w-[130px] truncate text-xs font-bold sm:block">{user?.name || "User"}</span>
              </button>
            </div>
          </header>
          <div className="border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
            <div className="flex gap-1.5 overflow-x-auto">
              {nav.map(([icon,label,path]) => <button key={label} onClick={()=>window.location.href=path} className={"flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold " + (active===path ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 text-slate-600")}><Icon name={icon} size={13}/>{label}</button>)}
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-9">{children}</div>
        </section>
      </div>
    </main>
  );
}
