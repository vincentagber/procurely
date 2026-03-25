"use client";

import { ArrowRight } from "lucide-react";

export function SupplierOnboardingForm() {
  return (
    <div id="onboard" className="bg-white rounded-[2.9rem] p-10 sm:p-14">
      <h3 className="text-2xl font-black text-[#13184f] mb-8">Start Application</h3>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</label>
            <input type="text" className="w-full bg-[#f6f7fd] border border-slate-100 rounded-xl px-4 py-4 outline-none focus:border-[#1900ff] transition" placeholder="e.g. Aliko Supplies Ltd" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Focus</label>
            <select className="w-full bg-[#f6f7fd] border border-slate-100 rounded-xl px-4 py-4 outline-none focus:border-[#1900ff] transition">
              <option>Cement & Aggregates</option>
              <option>Iron & Rebar</option>
              <option>Finishing & Sanitary</option>
              <option>Paints & Chemicals</option>
              <option>General Hardware</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Email</label>
          <input type="email" className="w-full bg-[#f6f7fd] border border-slate-100 rounded-xl px-4 py-4 outline-none focus:border-[#1900ff] transition" placeholder="partners@company.com" />
        </div>
        <button type="button" className="w-full h-16 bg-[#13184f] hover:bg-[#1900ff] text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3">
          Submit Application <ArrowRight className="size-5" />
        </button>
        <p className="text-[11px] text-center text-slate-400 font-medium">By submitting, you agree to our <a href="/terms-of-use" className="underline">Partnership Agreement</a>.</p>
      </form>
    </div>
  );
}
