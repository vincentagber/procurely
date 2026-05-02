"use client";

import React from "react";
import Link from "next/link";
import {
  Settings,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowUpRight
} from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { useAuth } from "@/components/auth/auth-provider";
import dynamic from "next/dynamic";
import { OrderHistoryTable } from "@/components/dashboard/order-history-table";
import { AdminProfileSidebar } from "@/components/dashboard/admin-profile-sidebar";

// Dynamic imports for Recharts to avoid hydration issues
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false });

const spendData = [
  { name: "16.02", payments: 220000, orders: 200000 },
  { name: "17.02", payments: 190000, orders: 210000 },
  { name: "21.02", payments: 260000, orders: 180000 },
  { name: "22.02", payments: 210000, orders: 200000 },
];

const categoryData = [
  { name: "Sand", value: 45, fill: "#F97316" }, // Orange
  { name: "Cement", value: 25, fill: "#10B981" }, // Green
  { name: "Rebars", value: 20, fill: "#2563EB" }, // Royal Blue
  { name: "Finishing", value: 10, fill: "#94A3B8" }, // Grey
  { name: "Extra", value: 5, fill: "#93C5FD" }, // Light Blue segment (visual only)
];

const supplierData = [
  { name: "Mon", value: 3, fill: "#60A5FA" }, // Mid-Blue
  { name: "Tue", value: 4, fill: "#60A5FA" }, // Mid-Blue
  { name: "Wed", value: 4.5, fill: "#BFDBFE" }, // Light-Blue
  { name: "Thu", value: 5.5, fill: "#60A5FA" }, // Mid-Blue
  { name: "Fri", value: 3.5, fill: "#BFDBFE" }, // Light-Blue
  { name: "Sat", value: 1.5, fill: "#60A5FA" }, // Mid-Blue
];

const activityData = [
  { name: "Mon", value: 8, fill: "#2563EB" }, // Bright Blue
  { name: "Tue", value: 6, fill: "#BFDBFE" }, // Light Blue
  { name: "Wed", value: 9, fill: "#2563EB" }, // Bright Blue
  { name: "Thu", value: 6, fill: "#BFDBFE" }, // Light Blue
  { name: "Fri", value: 10, fill: "#2563EB" }, // Bright Blue
  { name: "Sat", value: 8, fill: "#2563EB" }, // Bright Blue
];

const performanceData = [
  { name: "On-Time", value: 23, fill: "#2DD4BF" }, // Teal/Aqua
  { name: "Delayed", value: 57, fill: "#F97316" }, // Orange
];

export default function AccountDashboardClient() {
  const { user } = useAuth();

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-0 space-y-10">
      
      {/* Two-column Layout Wrapper */}
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN: Main Dashboard Content */}
        <div className="flex-1 space-y-10 min-w-0">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-2 pb-6 border-b border-slate-200 gap-6">
            <div className="flex flex-col w-full max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0001FF] tracking-tight m-0 leading-tight">
                Hello {user?.fullName?.split(' ')[0] || 'Admin'}!
              </h1>
              <p className="text-[14px] font-medium text-slate-400 mt-2 leading-tight">
                Welcome back, let&apos;s manage your procurement.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <NotificationDropdown />
              <button className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group hover:bg-slate-50 hover:shadow-md transition-all">
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* TOP CARDS - Dimension Sync: 673px total width, 84px height */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[10.11px] max-w-[674px]">
            {/* CARD 1: Orders */}
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center h-[84px] border border-slate-50">
              <div className="w-[60px] h-[40px] -ml-2">
                <ResponsiveContainer>
                  <LineChart data={[{v:50},{v:40},{v:60},{v:30},{v:70},{v:40},{v:80}]}>
                    <Line dataKey="v" stroke="#7C3AED" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-[24px] font-black text-[#0A1140] leading-none">124</span>
                  <div className="flex flex-col items-start">
                     <span className="text-[10px] font-bold text-[#0A1140] leading-none">Orders</span>
                     <span className="text-[9px] bg-blue-50 text-blue-600 px-1 rounded-sm font-black mt-0.5">+10%</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 font-bold mt-1">
                  In the last <span className="text-slate-600">10 Weeks</span>
                </p>
              </div>
            </div>

            {/* CARD 2: Requests */}
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center h-[84px] border border-slate-50">
              <div className="w-[60px] h-[40px] -ml-2">
                <ResponsiveContainer>
                  <LineChart data={[{v:20},{v:60},{v:40},{v:80},{v:50},{v:90}]}>
                    <Line dataKey="v" stroke="#10B981" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-[24px] font-black text-[#0A1140] leading-none">30</span>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-bold text-[#0A1140] leading-none">Request</span>
                    <span className="text-[8px] text-emerald-500 font-black mt-0.5">+3 new</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 font-bold mt-1">Total requests today</p>
              </div>
            </div>

            {/* CARD 3: Savings */}
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center h-[84px] border border-slate-50">
              <div className="w-[60px] h-[40px] -ml-2">
                <ResponsiveContainer>
                  <LineChart data={[{v:40},{v:70},{v:50},{v:80},{v:60},{v:75}]}>
                    <Line dataKey="v" stroke="#FF5C00" strokeWidth={2} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-[24px] font-black text-[#0A1140] leading-none">₦4.2M</span>
                  <span className="text-orange-500 font-black text-[10px]">-5%</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold mt-1">Total cost savings</p>
              </div>
            </div>
          </div>

          {/* MAIN CHART */}
          <div className="bg-white rounded-2xl p-8 shadow-sm h-[420px]">
            <div className="flex justify-between mb-6">
              <h3 className="font-extrabold text-lg text-[#0A1140]">Procurement Spend Overview</h3>
            </div>
            <ResponsiveContainer>
              <AreaChart data={spendData}>
                <defs>
                  <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0047FF" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#0047FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5C00" stopOpacity={0.1}/>
                    <stop offset="100%" stopColor="#FF5C00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(v)=> v===0 ? "0" : `₦${v/1000}k`}/>
                <Tooltip/>
                <Area type="monotone" dataKey="payments" stroke="#0047FF" fill="url(#blue)" strokeWidth={3} dot={{ r: 4, fill: '#0047FF' }} />
                <Area type="monotone" dataKey="orders" stroke="#FF5C00" fill="url(#orange)" strokeWidth={3} dot={{ r: 4, fill: '#FF5C00' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* GRID: Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Material Category Spend Card */}
            <div className="bg-white shadow-sm border border-slate-50 w-full xl:w-[324px] h-[215px] p-[13px]" style={{ borderRadius: '6.19px' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-[13px] text-[#0A1140]">Material Category Spend</h3>
                <div className="flex bg-slate-100 rounded-md p-0.5">
                   <button className="px-2 py-0.5 text-[9px] font-bold bg-white shadow-sm rounded-sm text-blue-600">1w</button>
                   <button className="px-2 py-0.5 text-[9px] font-bold text-slate-400">1m</button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[120px] h-[120px] shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie 
                        data={categoryData} 
                        innerRadius={35} 
                        outerRadius={55} 
                        dataKey="value" 
                        stroke="none"
                      >
                        {categoryData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 flex-1">
                  {categoryData.filter(i => i.name !== 'Extra').map(item => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-slate-500 text-[11px] font-black">{item.name}</span>
                      </div>
                      <span className="font-black text-[12px] text-[#0A1140]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Supplier Distribution Card */}
            <div className="bg-white border border-slate-50 w-full xl:w-[332px] h-[216px] p-[15px] rounded-[15px]" style={{ boxShadow: '0px 5.81px 23.24px 0px #3326AE14' }}>
              <h3 className="font-black text-[13px] mb-4 text-[#0A1140]">Supplier Distribution</h3>
              <ResponsiveContainer height={145}>
                <BarChart data={supplierData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                  <YAxis domain={[0, 6]} axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} ticks={[2, 3, 4, 5]} tickFormatter={(v) => `${v} ★`} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={22}>
                    {supplierData.map((entry, i) => (
                       <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRID: Charts Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[10px] items-start mt-6">
            {/* Order Activity Card */}
            <div className="bg-white shadow-sm border border-slate-50 w-full xl:w-[325px] h-[120px] pt-[21px] pr-[15px] pb-[15px] pl-[15px] rounded-[15px]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-[12px] text-[#0A1140]">Order Activity</h3>
                <div className="flex bg-slate-100 rounded-md p-0.5">
                   <button className="px-1.5 py-0.5 text-[8px] font-bold bg-white shadow-sm rounded-sm text-blue-600">1w</button>
                   <button className="px-1.5 py-0.5 text-[8px] font-bold text-slate-400">1m</button>
                </div>
              </div>
              <ResponsiveContainer height={60}>
                <BarChart data={activityData}>
                  <XAxis dataKey="name" hide />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={18}>
                    {activityData.map((entry, i) => (
                       <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-1 px-1">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                   <span key={day} className="text-[8px] font-bold text-slate-400">{day}</span>
                 ))}
              </div>
            </div>

            {/* Delivery Performance Card - Dimension Sync: 330x120px */}
            <div className="bg-white shadow-sm border border-slate-50 w-full xl:w-[330px] h-[120px] pt-[15px] pr-[10px] pb-[30px] pl-[10px] rounded-[8px]">
              <h3 className="font-black text-[12px] mb-3 text-[#0A1140]">Delivery Performance</h3>
              <div className="flex items-center justify-between px-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-slate-500">On-Time</span>
                       <span className="text-[12px] font-black text-[#0A1140]">23%</span>
                    </div>
                 </div>
                 <div className="flex gap-1.5 items-end h-[40px]">
                    <div className="w-[20px] bg-[#2DD4BF] rounded-t-sm" style={{ height: '15px' }} />
                    <div className="w-[20px] bg-[#F97316] rounded-t-sm" style={{ height: '35px' }} />
                 </div>
                 <div className="flex items-center gap-3 text-right">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-slate-500">Delayed</span>
                       <span className="text-[12px] font-black text-[#0A1140]">57%</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                 </div>
              </div>
            </div>
          </div>

          {/* Orders History Table */}
          <OrderHistoryTable />
        </div>

        {/* RIGHT COLUMN: Admin Profile Sidebar */}
        <div className="shrink-0 xl:sticky xl:top-6 self-start">
           <AdminProfileSidebar />
        </div>

      </div>
    </div>
  );
}
