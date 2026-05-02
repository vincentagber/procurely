"use client";

import React from "react";
import { 
  Users, 
  Settings, 
  Plus, 
  ChevronRight, 
  FileText, 
  ClipboardList, 
  Truck, 
  UserPlus,
  Briefcase
} from "lucide-react";

export function AdminProfileSidebar() {
  return (
    <aside className="w-full xl:w-[230px] space-y-6">
      {/* My Profile Card */}
      <div className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-50 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-full flex justify-between items-center mb-6 px-1">
          <h2 className="text-xl font-black text-[#0A1140]">My profile</h2>
          <div className="flex gap-4 text-slate-300">
            <Users size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
            <Settings size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Avatar */}
        <div className="relative mb-6">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-[6px] border-white shadow-xl ring-1 ring-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="mb-8">
          <h3 className="text-[22px] font-black text-[#0A1140] leading-tight">Olusegun <span className="text-slate-400">Akapo</span></h3>
          <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Procurement Manager</p>
        </div>

        {/* Progress */}
        <div className="w-full px-2">
          <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden mb-3">
            <div className="h-full w-[70%] bg-[#FF5C00] rounded-full" />
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[12px] font-bold text-slate-400">Profile Completion</span>
            <span className="text-[18px] font-black text-[#0A1140]">70</span>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-[32px] p-4 shadow-sm border border-slate-50">
        <h3 className="text-lg font-black text-[#0A1140] mb-6">Activity Summary</h3>
        
        <div className="space-y-6">
          <SummaryItem 
            icon={<ClipboardList size={18} className="text-[#FF5C00]" />} 
            label="Requests created" 
            value={142} 
            bgColor="bg-orange-50"
          />
          <SummaryItem 
            icon={<FileText size={18} className="text-[#0047FF]" />} 
            label="Orders delivered" 
            value={95} 
            bgColor="bg-blue-50"
          />
          <SummaryItem 
            icon={<Briefcase size={18} className="text-emerald-500" />} 
            label="Suppliers engaged" 
            value={37} 
            bgColor="bg-emerald-50"
          />
          <SummaryItem 
            icon={<Truck size={18} className="text-amber-500" />} 
            label="Deliveries in progress" 
            value={4} 
            bgColor="bg-amber-50"
          />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <h4 className="text-[15px] font-black text-[#0A1140] mb-6 uppercase tracking-wider">Quick Tools</h4>
          <div className="space-y-3">
             <ToolAction icon={<Plus className="text-blue-600" />} label="Upload BoQ Document" size="12 MB" />
             <ToolAction icon={<Plus className="text-blue-600" />} label="Created New RFQ" size="2 MB" />
             <ToolAction icon={<UserPlus className="text-emerald-500" />} label="Add New Supplier" size="22 KB" />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[15px] font-black text-[#0A1140] uppercase tracking-wider">Recent Documents</h4>
            <button className="text-[12px] font-bold text-[#FF5C00] hover:underline">View All</button>
          </div>
          <div className="space-y-3">
             <DocItem label="BoQ: Updated.xlx" size="23 MB" type="excel" />
             <DocItem label="Invoice: 054 pdf" size="26 MB" type="pdf" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function SummaryItem({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: number; bgColor: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        <span className="text-[13px] font-bold text-slate-500">{label}</span>
      </div>
      <span className="text-[15px] font-black text-[#0A1140]">{value}</span>
    </div>
  );
}

function ToolAction({ icon, label, size }: { icon: React.ReactNode; label: string; size: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-[13px] font-bold text-[#0A1140] leading-tight">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{size}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600" />
    </button>
  );
}

function DocItem({ label, size, type }: { label: string; size: string; type: 'excel' | 'pdf' }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
          <FileText size={18} className={type === 'excel' ? 'text-amber-500' : 'text-rose-500'} />
        </div>
        <div className="text-left">
          <p className="text-[13px] font-bold text-[#0A1140] leading-tight">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{size}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600" />
    </button>
  );
}
