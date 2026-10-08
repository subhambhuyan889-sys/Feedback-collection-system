import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";

const KEY="feedpro-settings";
export default function Settings(){
  const [values,setValues]=useState({notifications:true,visibility:true}),[saved,setSaved]=useState(false);
  useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(KEY));if(v)setValues(v)}catch{}},[]);
  const toggle=k=>setValues(v=>({...v,[k]:!v[k]}));
  const save=()=>{localStorage.setItem(KEY,JSON.stringify(values));setSaved(true);setTimeout(()=>setSaved(false),2200)};
  return <AppShell title="Settings"><div className="mx-auto max-w-3xl">
    <div className="mb-7"><p className="text-xs font-semibold text-slate-400">Preferences</p><h2 className="mt-1 text-[30px] font-extrabold tracking-[-0.03em]">Settings</h2><p className="mt-1 text-sm text-slate-500">Control how your feedback workspace behaves on this device.</p></div>
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {[["notifications","Response notifications","Keep feedback activity visible in your workspace."],["visibility","Profile visibility","Allow your basic profile information to be visible to your team."]].map(([key,title,desc])=><div key={key} className="flex items-center justify-between gap-5 border-b border-slate-100 p-5 last:border-0"><div><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p></div><button type="button" aria-pressed={values[key]} onClick={()=>toggle(key)} className={"relative h-6 w-11 rounded-full transition "+(values[key]?"bg-slate-950":"bg-slate-200")}><span className={"absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition "+(values[key]?"left-6":"left-1")}/></button></div>)}
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/60 p-5"><p className="text-xs text-slate-500">{saved?"Preferences saved locally.":"Changes are stored on this device."}</p><button onClick={save} className="rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800">Save changes</button></div>
    </section>
  </div></AppShell>;
}