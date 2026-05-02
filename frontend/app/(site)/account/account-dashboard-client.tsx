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
  { name: "Sand", value: 45, color: "#F97316" },
  { name: "Cement", value: 25, color: "#10B981" },
  { name: "Rebars", value: 20, color: "#2563EB" },
  { name: "Finishing", value: 10, color: "#94A3B8" },
];

const supplierData = [
  { name: "Mon", value: 3 },
  { name: "Tue", value: 3.5 },
  { name: "Wed", value: 4 },
  { name: "Thu", value: 5 },
  { name: "Fri", value: 3 },
  { name: "Sat", value: 2 },
];

const activityData = [
  { name: "Mon", value: 10 },
  { name: "Tue", value: 9 },
  { name: "Wed", value: 12 },
  { name: "Thu", value: 9 },
  { name: "Fri", value: 13 },
  { name: "Sat", value: 11 },
];

export default function AccountDashboardClient() {
  const { user } = useAuth();

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-0 space-y-10">
      
      {/* Header Section (Kept from existing) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-2 pb-6 border-b border-slate-200 gap-6">
        <div className="flex flex-col w-full max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0001FF] tracking-tight m-0 leading-tight">
            Hello {user?.fullName?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-[14px] font-medium text-slate-400 mt-2 leading-tight">
            Welcome back, let's manage your procurement.
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <NotificationDropdown />
          <button className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group hover:bg-slate-50 hover:shadow-md transition-all">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CARD 1 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm flex justify-between items-center">
          <div className="w-[140px] h-[70px] -ml-4">
            <ResponsiveContainer>
              <LineChart data={[{v:50},{v:40},{v:60},{v:30},{v:70},{v:40},{v:80}]}>
                <Line dataKey="v" stroke="#7C3AED" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-[34px] font-extrabold text-[#0A1140]">124</span>
              <span className="font-bold text-[#0A1140]">Orders</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">+10%</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">
              In the last <span className="text-slate-500">10 Weeks</span>
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm flex justify-between items-center">
          <div className="w-[140px] h-[70px] -ml-4">
            <ResponsiveContainer>
              <LineChart data={[{v:20},{v:60},{v:40},{v:80},{v:50},{v:90}]}>
                <Line dataKey="v" stroke="#10B981" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-[34px] font-extrabold text-[#0A1140]">30</span>
              <span className="font-bold text-[#0A1140]">Request</span>
            </div>
            <p className="text-xs text-emerald-500 font-bold">+3 new today</p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-white rounded-2xl p-8 shadow-sm flex justify-between items-center">
          <div className="w-[140px] h-[70px] -ml-4">
            <ResponsiveContainer>
              <LineChart data={[{v:40},{v:70},{v:50},{v:80},{v:60},{v:75}]}>
                <Line dataKey="v" stroke="#FF5C00" strokeWidth={3} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-[34px] font-extrabold text-[#0A1140]">₦4.2M</span>
              <span className="text-orange-500 font-bold text-sm">-5%</span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">Total cost savings</p>
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

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="font-bold mb-6 text-[#0A1140]">Material Category Spend</h3>

          <div className="flex items-center gap-10">
            <div className="w-[180px] h-[180px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryData} innerRadius={45} outerRadius={90} dataKey="value" stroke="none">
                    {categoryData.map((entry,i)=>(
                      <Cell key={i} fill={entry.color}/>
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 flex-1">
              {categoryData.map(item=>(
                <div key={item.name} className="flex justify-between gap-10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-slate-500 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-[#0A1140]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BAR */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="font-bold mb-6 text-[#0A1140]">Supplier Distribution</h3>

          <ResponsiveContainer height={250}>
            <BarChart data={supplierData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
              <Bar dataKey="value" fill="#2563EB" radius={[10,10,6,6]} barSize={38}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="font-bold mb-6 text-[#0A1140]">Order Activity</h3>

          <ResponsiveContainer height={250}>
            <BarChart data={activityData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
              <YAxis domain={[0,15]} axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
              <Bar dataKey="value" radius={[10,10,10,10]} barSize={30}>
                {activityData.map((_,i)=>(
                  <Cell key={i} fill={i%2===0 ? "#2563EB" : "#93C5FD"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DELIVERY */}
        <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-center items-center gap-8">
          <h3 className="font-bold text-[#0A1140] self-start">Delivery Performance</h3>

          <div className="flex gap-10 items-end flex-1 justify-center pb-4">
            <div className="w-[55px] h-[70px] bg-emerald-400 rounded-xl shadow-lg shadow-emerald-100" />
            <div className="w-[55px] h-[110px] bg-orange-400 rounded-xl shadow-lg shadow-orange-100" />
          </div>

          <div className="flex gap-10 border-t border-slate-50 pt-6 w-full justify-center">
            <span className="font-bold text-[#0A1140] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" /> On-Time 23%
            </span>
            <span className="font-bold text-[#0A1140] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" /> Delayed 57%
            </span>
          </div>
        </div>

      </div>

      {/* Orders History Table */}
      <OrderHistoryTable />
    </div>
  );
}
