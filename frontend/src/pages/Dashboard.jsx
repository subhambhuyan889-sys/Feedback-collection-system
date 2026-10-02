const stats = [
  { label: "Forms", value: "0" },
  { label: "Responses", value: "0" },
  { label: "Pending", value: "0" },
  { label: "Avg. Rating", value: "—" },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">Feedback Collection System</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Manage feedback forms and track responses from one place.</p>
          </div>
          <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">Settings</button>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">My Feedback Forms</h2>
                <p className="mt-1 text-sm text-slate-500">Your created forms and response activity.</p>
              </div>
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Create Form</button>
            </div>
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <p className="font-medium text-slate-700">No forms yet</p>
              <p className="mt-1 text-sm text-slate-500">Create your first feedback form to start collecting responses.</p>
            </div>
          </div>

          <aside className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 space-y-3">
              {["View Responses", "Analytics", "Profile"].map((item) => (
                <button key={item} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700">
                  {item}
                </button>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
