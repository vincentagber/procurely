"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Upload,
  FilePlus,
  UserPlus,
  FileText,
  ChevronRight,
  Eye,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Settings,
  MoreVertical,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
  ShoppingCart,
  LayoutDashboard,
  Plus,
  FileDown,
  ChevronDown,
  Filter,
  Wallet,
  Gift
} from "lucide-react";
import { DashboardHeader } from "./shared/dashboard-header";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false });
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false });
const LineChart = dynamic(() => import("recharts").then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then(mod => mod.Line), { ssr: false });
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";

/**
 * PROCURELY™ HIGH-FIDELITY DASHBOARD
 * Based on Profile-Dashboard.png design reference.
 */

// --- Simulation Data ---
const spendData = [
  { name: '16.02', orders: 200000, payments: 240000 },
  { name: '17.02', orders: 230000, payments: 210000 },
  { name: '21.02', orders: 180000, payments: 200000 },
  { name: '21.02', orders: 250000, payments: 280000 },
  { name: '21.02', orders: 290000, payments: 260000 },
  { name: '22.02', orders: 260000, payments: 220000 },
];

const categoryData = [
  { name: 'Sand', value: 45, color: '#FF5C00' },
  { name: 'Cement', value: 25, color: '#23C1A1' },
  { name: 'Rebars', value: 20, color: '#0047FF' },
  { name: 'Finishing', value: 10, color: '#94A3B8' },
];

const supplierData = [
  { day: 'Mon', count: 35 },
  { day: 'Tue', count: 48 },
  { day: 'Wed', count: 62 },
  { day: 'Thu', count: 90 },
  { day: 'Fri', count: 55 },
  { day: 'Sat', count: 42 },
];

const orderHistory = [
  { id: 'PRO102563', supplier: 'Traxus Industrial', total: '₦80,000', date: 'Mar 1, 2024', status: 'Processing', color: 'orange' },
  { id: 'PRO102567', supplier: 'Gibson Holdings', total: '₦45,000', date: 'Mar 1, 2024', status: 'In Progress', color: 'blue' },
  { id: 'PRO102541', supplier: 'Halcyon Supplies', total: '₦85,000', date: 'Mar 1, 2024', status: 'Delivered', color: 'green' },
  { id: 'PRO102532', supplier: 'Primelogic Systems', total: '₦85,000', date: 'Mar 1, 2024', status: 'Canceled', color: 'red' },
];



export default function ProfileDashboard() {
  const { user } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHasMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersData = await api.getAccountOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error("Dashboard data fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted) {
    return <div className="min-h-screen bg-[#F8F9FA] animate-pulse" />;
  }

  const activeOrders = orders.filter(o => o.status === 'processing' || o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'paid').length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto min-w-0">
      <DashboardHeader />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-[16px] w-full min-w-0">
      
      {/* 🚀 CENTRAL CONTENT COLUMN */}
      <div className="space-y-[10px] min-w-0">
        
        {/* Breadcrumb Bar */}
        <div className="bg-white rounded-[8px] border border-slate-100 p-4 mb-2 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
           <span>Home</span> 
           <span className="mx-2 text-slate-200">/</span> 
           <span className="text-slate-400">Dashboard</span> 
        </div>
        
        {/* Top Metric Bar */}
        <div 
          className="flex items-center mb-8" 
          style={{ width: '673.69px', gap: '10.11px' }}
        >
           {/* Metric 1: Orders */}
           <div 
             className="bg-white flex items-center gap-3 shadow-sm border border-slate-50" 
             style={{ 
               width: '217.82px', 
               height: '84.02px', 
               borderRadius: '6.22px',
               paddingLeft: '7.78px',
               paddingRight: '15.56px'
             }}
           >
              <div className="w-[80px] h-[50px] shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:20},{v:45},{v:30},{v:50},{v:40},{v:60}]}>
                       <Line type="monotone" dataKey="v" stroke="#7C3AED" strokeWidth={2.5} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-black text-[#0C1457] leading-none">124</span>
                    <span className="text-[14px] font-bold text-[#0C1457] leading-none">Orders</span>
                    <span className="text-[10px] font-bold text-blue-600 ml-0.5">+10%</span>
                 </div>
                 <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] font-bold text-slate-400">In the last</span>
                    <span className="text-[8px] font-black bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-full uppercase">10 Weeks</span>
                 </div>
              </div>
           </div>

           {/* Metric 2: Request */}
           <div 
             className="bg-white flex items-center gap-3 shadow-sm border border-slate-50" 
             style={{ 
               width: '217.82px', 
               height: '84.02px', 
               borderRadius: '6.22px',
               paddingLeft: '7.78px',
               paddingRight: '15.56px'
             }}
           >
              <div className="w-[80px] h-[50px] shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:10},{v:30},{v:20},{v:60},{v:40},{v:80}]}>
                       <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2.5} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-black text-[#0C1457] leading-none">30</span>
                    <span className="text-[14px] font-bold text-[#0C1457] leading-none">Request</span>
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                   <span className="text-emerald-500 mr-1">↑</span> +3 new today
                 </span>
              </div>
           </div>

           {/* Metric 3: Savings */}
           <div 
             className="bg-white flex items-center gap-3 shadow-sm border border-slate-50" 
             style={{ 
               width: '217.82px', 
               height: '84.02px', 
               borderRadius: '6.22px',
               paddingLeft: '7.78px',
               paddingRight: '15.56px'
             }}
           >
              <div className="w-[80px] h-[50px] shrink-0">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:50},{v:40},{v:60},{v:30},{v:70},{v:40}]}>
                       <Line type="monotone" dataKey="v" stroke="#FF5C00" strokeWidth={2.5} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-[20px] font-black text-[#0C1457] leading-none">N4.2M</span>
                    <span className="text-[10px] font-bold text-orange-500 ml-1">-5% c/s</span>
                 </div>
                 <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Total cost savings</span>
              </div>
           </div>
        </div>

        {/* Procurement Spend Overview Section */}
        <section className="bg-white p-8 rounded-[16px] shadow-sm border border-slate-50 flex flex-col h-[400px]">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-[18px] font-black text-[#0A1140]">Procurement Spend Overview</h3>
              <div className="flex flex-col items-end gap-4">
                 <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg">
                    {['7 Days', '30 Days', '90 Days'].map((tab, idx) => (
                       <button key={tab} className={`px-4 py-1.5 text-[11px] font-black rounded-md transition-all ${idx === 0 ? 'bg-white text-[#0A1140] shadow-sm' : 'text-slate-400'}`}>
                          {tab}
                       </button>
                    ))}
                 </div>
                 <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2 text-[#FF5C00] text-[11px] font-black">
                       <div className="w-2 h-2 rounded-full bg-[#FF5C00]" /> Orders Placed
                    </span>
                    <span className="flex items-center gap-2 text-[#0047FF] text-[11px] font-black">
                       <div className="w-2 h-2 rounded-full bg-[#0047FF]" /> Payments Made
                    </span>
                 </div>
              </div>
           </div>

           <div className="flex-1 w-full translate-x-[-15px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={spendData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#94A3B8', fontSize: 13, fontWeight: 700}} 
                       dy={15}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 700}} 
                       tickFormatter={(v) => `N${v/1000}k`}
                       ticks={[0, 200000, 260000]}
                    />
                    <Tooltip cursor={{ stroke: '#00D1FF', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area 
                      type="monotone" 
                      dataKey="payments" 
                      stroke="#0047FF" 
                      strokeWidth={3} 
                      fillOpacity={0} 
                      dot={{r: 5, fill: '#0047FF', strokeWidth: 2, stroke: '#fff'}}
                      activeDot={{ r: 7, strokeWidth: 0 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#FF5C00" 
                      strokeWidth={3} 
                      fillOpacity={0} 
                      dot={{r: 5, fill: '#FF5C00', strokeWidth: 2, stroke: '#fff'}}
                      activeDot={{ r: 7, strokeWidth: 0 }}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </section>

        {/* Split Section: Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
           
           {/* Category Spend (Donut) */}
           <div className="bg-white rounded-[8px] p-6 lg:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[13px] font-black text-[#0A1140] uppercase tracking-wider">Material Category Spend</h3>
                 <div className="flex gap-2">
                   <button className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-[#1D4ED8] rounded uppercase">7W</button>
                   <button className="text-[10px] font-bold px-2 py-1 text-slate-400 hover:text-slate-600 rounded uppercase">4M</button>
                 </div>
              </div>
              <div className="flex items-center gap-8">
                 <div className="w-[140px] h-[140px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                             {categoryData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex-1 space-y-3">
                    {categoryData.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between group cursor-default">
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                             <span className="text-[12px] font-bold text-slate-500 group-hover:text-[#0A1140] transition-colors">{item.name}</span>
                          </div>
                          <span className="text-[12px] font-black text-[#0A1140]">{item.value}%</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Supplier Distribution (Bars) */}
           <div className="bg-white rounded-[16px] p-8 shadow-sm border border-slate-50 flex flex-col h-[320px]">
              <h3 className="text-[18px] font-black text-[#0A1140] mb-6">Supplier Distribution</h3>
              <div className="flex-1 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94A3B8', fontSize: 13, fontWeight: 700}} 
                          dy={15} 
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}}
                          tickFormatter={(v) => `${v} stars`}
                          ticks={[2, 3, 4, 5]}
                       />
                       <Bar 
                          dataKey="count" 
                          radius={[6, 6, 6, 6]} 
                          barSize={28}
                       >
                          {supplierData.map((entry, index) => (
                            <Cell 
                               key={`cell-${index}`} 
                               fill={index % 2 === 0 ? '#60A5FA' : '#3B82F6'} 
                               className="transition-all hover:opacity-80" 
                            />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Small Widgets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
           {/* Order Activity */}
           <div className="bg-white rounded-[16px] p-8 shadow-sm border border-slate-50">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-[18px] font-black text-[#0A1140]">Order Activity</h3>
                    <p className="text-[12px] font-bold text-slate-400 mt-1">Projected volume vs Actuals</p>
                 </div>
                 <div className="flex gap-1 bg-slate-50 p-1 rounded-lg">
                    <button className="px-3 py-1 text-[10px] font-black bg-white shadow-sm rounded-md uppercase">1W</button>
                    <button className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase">1M</button>
                 </div>
              </div>
              <div className="h-[140px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierData}>
                       <Bar dataKey="count" radius={[5, 5, 5, 5]} barSize={24}>
                          {supplierData.map((e, i) => (
                             <Cell key={`b-${i}`} fill={i % 2 === 0 ? '#1D4ED8' : '#60A5FA'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Delivery Performance */}
           <div className="bg-white rounded-[16px] p-8 shadow-sm border border-slate-50">
              <h3 className="text-[18px] font-black text-[#0A1140] mb-12">Delivery Performance</h3>
              <div className="flex flex-col gap-10">
                 <div className="flex gap-4">
                    <div className="h-10 w-[33%] bg-[#23C1A1] rounded-lg shadow-[0_4px_12px_rgba(35,193,161,0.2)]" />
                    <div className="h-10 w-[67%] bg-[#FF5C00] rounded-lg shadow-[0_4px_12px_rgba(255,92,0,0.2)]" />
                 </div>
                 <div className="flex items-center justify-around">
                    <span className="flex items-center gap-3 text-[13px] font-black text-[#0A1140]">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#23C1A1]" /> On-Time <span className="text-slate-400 ml-1">23%</span>
                    </span>
                    <span className="flex items-center gap-3 text-[13px] font-black text-[#0A1140]">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#FF5C00]" /> Delayed <span className="text-slate-400 ml-1">57%</span>
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Orders History Table (Transaction History) */}
        <section 
          className="bg-white flex flex-col overflow-hidden"
          style={{
            width: '667px',
            height: '698px',
            borderRadius: '9.35px',
            padding: '9.35px',
            boxShadow: '0px 5.81px 23.24px 0px #3326AE14'
          }}
        >
           {/* Search & Top Filters */}
           <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input type="text" placeholder="Search Transaction" className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none" />
              </div>
              <div className="h-11 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-[12px] font-bold text-[#0A1140] shadow-sm whitespace-nowrap">
                 Feb 01, 2026 - Mar 01 <Plus size={14} className="text-[#0A1140]" />
              </div>
              <button className="h-11 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[12px] font-bold text-[#0A1140] shadow-sm hover:bg-slate-50 shrink-0">
                  <FileDown size={16} className="text-slate-400" /> Export <ChevronDown size={14} className="text-slate-400" />
              </button>
           </div>

           {/* Tabs & Inner Filters */}
           <div className="flex items-center justify-between gap-4 mb-4 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-6">
                 {['All', 'Active', 'Completed', 'Canceled', 'More'].map((tab, idx) => (
                    <button key={tab} className={`pb-2 text-[13px] font-bold transition-all relative ${idx === 0 ? 'text-[#1D4ED8]' : 'text-slate-400 hover:text-slate-600'}`}>
                       {tab}
                       {idx === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#1D4ED8] rounded-full" />}
                    </button>
                 ))}
              </div>
              <div className="flex items-center gap-2">
                 <button className="h-9 px-3 flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg whitespace-nowrap">
                    <FileDown size={14} className="text-slate-400" /> Export CSV <ChevronDown size={12} className="text-slate-400" />
                 </button>
                 <button className="h-9 px-3 flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg whitespace-nowrap">
                    <Filter size={14} className="text-slate-400" /> Filter <ChevronDown size={12} className="text-slate-400" />
                 </button>
              </div>
           </div>

           {/* Table Body */}
           <div className="flex-1 overflow-y-auto w-full">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[12px] font-black text-[#0A1140] uppercase border-b border-slate-50">
                       <th className="py-4 font-black">Order ID</th>
                       <th className="py-4 font-black">Supplier</th>
                       <th className="py-4 font-black">Total Amount</th>
                       <th className="py-4 font-black">Date Placed</th>
                       <th className="py-4 font-black">Delivery Status</th>
                       <th className="py-4 font-black text-right pr-4">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Fetching ledger...</td></tr>
            ) : orders.length > 0 ? (
              orders.slice(0, 7).map((order, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-4">
                      <p className="text-[14px] font-extrabold text-[#0A1140] mb-0.5">{order.order_number || "PRO102563"}</p>
                      <p className="text-[11px] font-medium text-slate-400">A85064</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[14px] font-extrabold text-[#0A1140] mb-0.5">{order.shipping_name || "Traxus Industrial"}</p>
                      <p className="text-[11px] font-medium text-slate-400">8 items supplied</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[14px] font-extrabold text-[#0A1140]">N{(order.total / 100).toLocaleString()}</p>
                      <p className="text-[11px] font-medium text-slate-400">N80,000</p>
                    </td>
                    <td className="py-4">
                      <p className="text-[14px] font-extrabold text-slate-700 mb-0.5">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-[11px] font-medium text-slate-400">Mar 1, 2024</p>
                    </td>
                    <td className="py-4">
                      <StatusBadge 
                        status={order.status.toUpperCase()} 
                        type={order.status === 'paid' || order.status === 'delivered' ? 'green' : order.status === 'pending' || order.status === 'processing' ? 'orange' : 'red'} 
                      />
                      <p className="text-[10px] font-medium text-slate-400 mt-1 ml-4">{order.status === 'paid' ? 'Feb 23, 2024' : 'Mar 10, 2026'}</p>
                    </td>
                    <td className="py-4 text-right pr-4">
                       <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#1D4ED8] transition-all shadow-sm ml-auto"><Eye size={16} /></button>
                    </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest">No recent procurement activity.</td></tr>
            )}
          </tbody>
        </table>
           </div>

           {/* Pagination Footer */}
           <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[13px] font-bold text-[#0A1140]">
              <div className="flex items-center gap-4">
                 <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded"><ChevronRight size={18} className="rotate-180" /></button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded"><ChevronRight size={18} className="rotate-180" /></button>
                 </div>
                 <span>Page <input type="text" defaultValue="1" className="w-10 h-8 border border-slate-200 rounded text-center outline-none" /> of 10</span>
                 <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded"><ChevronRight size={18} /></button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded"><ChevronRight size={18} /></button>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="px-3 py-1.5 border border-slate-200 rounded-lg flex items-center gap-2">
                    10 items per page
                 </div>
              </div>
           </div>
        </section>

      </div>

      {/* 👤 RIGHT SIDEBAR / ORDER TIMELINE COLUMN */}
      <aside 
        className="flex flex-col gap-[16px] hidden xl:flex min-w-0"
        style={{ width: '199px', height: '816.6px' }}
      >
         
         {/* Order Timeline Card */}
         <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100/50 flex flex-col">
            <h4 className="text-[15px] font-extrabold text-[#0C1457] mb-6">Order Timeline</h4>
            
            <div className="flex items-center justify-between mb-4">
               <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400">Payment Method.</p>
                  <p className="text-[11px] font-bold text-slate-600">Wallet Balance</p>
                  <p className="text-[14px] font-black text-[#0C1457]">N380,000.00</p>
               </div>
               <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-50">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-full h-full object-cover" />
               </div>
            </div>

            <div className="w-full h-1.5 bg-slate-50 rounded-full mb-6 overflow-hidden">
               <div className="bg-[#1D4ED8] h-full w-[65%] rounded-full shadow-[0_0_8px_rgba(29,78,216,0.3)]" />
            </div>

            <div className="space-y-2 mb-6 text-[11px] font-bold text-slate-500">
               <div className="flex justify-between"><span>Sub Total:</span> <span className="text-slate-700">N107,900</span></div>
               <div className="flex justify-between"><span>Delivery Fee:</span> <span className="text-slate-700">N6,300</span></div>
               <div className="flex justify-between text-orange-500 font-black"><span>Wallet Usage:</span> <span>-N96,500</span></div>
            </div>

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-dashed border-slate-100">
               <span className="text-[12px] font-black text-[#0C1457]">Total Paid</span>
               <span className="text-[14px] font-black text-[#0C1457]">N17,900</span>
            </div>

            <button className="w-full h-11 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-[10px] text-[12px] font-black tracking-tight shadow-md transition-all">
               Track Order
            </button>
         </div>

         {/* Payment Summary Card */}
         <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100/50 flex flex-col">
            <h4 className="text-[14px] font-extrabold text-[#0C1457] mb-5">Payment Summary</h4>
            
            <div className="space-y-2 mb-5">
               <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50">
                  <Wallet size={16} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-slate-600 truncate">Wallet Balance - N330,000</span>
               </div>
               <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50">
                  <FileDown size={16} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-orange-500 truncate">Download Invoice</span>
               </div>
               <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <Bell size={16} className="text-orange-500" />
                  <span className="text-[10px] font-bold text-orange-500 truncate">Request Support</span>
               </div>
            </div>

            <button className="w-full h-11 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-[10px] text-[12px] font-black tracking-tight shadow-md transition-all">
               Reorder All
            </button>
         </div>

         {/* Order Notes Card */}
         <div className="bg-white rounded-[16px] p-5 shadow-sm border border-slate-100/50 flex-1">
            <h4 className="text-[14px] font-extrabold text-[#0C1457] mb-4">Order Notes</h4>
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed capitalize">
               Wallet balance - N330,000
            </p>
         </div>

      </aside>

    </div>
    </div>
  );
}

// --- Internal Helper Components ---

function MetricCard({ label, value, trend, sub, color, data }: any) {
   const strokeColors: any = {
      blue: "#7C3AED", 
      green: "#10B981", 
      orange: "#FF5C00"
   };
   
   return (
      <div className="bg-white rounded-[16px] p-6 flex items-center justify-between shadow-sm border border-slate-50 transition-all hover:shadow-md h-[124px]">
         <div className="w-[110px] h-[60px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <Line type="monotone" dataKey="v" stroke={strokeColors[color]} strokeWidth={3} dot={false} />
               </LineChart>
            </ResponsiveContainer>
         </div>
         <div className="text-right flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-2">
               <h3 className="text-[32px] font-black text-[#0A1140] tracking-tighter leading-none">{value}</h3>
               <span className="text-[14px] font-black text-[#0A1140]">{label}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.includes('+') || trend.includes('new') ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                  {trend}
               </span>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{sub}</p>
            </div>
         </div>
      </div>
   );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
   const styles: any = {
      orange: "bg-orange-50 text-orange-600 border-orange-100",
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      green: "bg-emerald-50 text-emerald-600 border-emerald-100",
      red: "bg-rose-50 text-rose-600 border-rose-100",
   };
   
   return (
      <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-2 shadow-sm whitespace-nowrap ${styles[type]}`}>
         <div className={`w-1.5 h-1.5 rounded-full ${styles[type].split(' ')[1].replace('text-', 'bg-')}`} />
         <span className="uppercase tracking-widest">{status}</span>
      </div>
   );
}

function ActivityItem({ icon, label, count, color }: any) {
   const colors: any = {
      orange: "text-orange-500 bg-orange-50",
      blue: "text-blue-500 bg-blue-50",
      emerald: "text-emerald-500 bg-emerald-50",
      amber: "text-amber-500 bg-amber-50"
   };
   return (
      <div className="flex items-center justify-between group cursor-default">
         <div className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-slate-50 transition-colors ${colors[color]}`}>
               {icon}
            </div>
            <span className="text-[12px] font-bold text-slate-500 group-hover:text-[#0A1140] transition-colors">{label}</span>
         </div>
         <span className="text-[13px] font-black text-[#0A1140]">{count}</span>
      </div>
   );
}

function ToolItem({ icon, label, sub }: any) {
   return (
      <button className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-50 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#1D4ED8] transition-colors">
               {icon}
            </div>
            <div className="text-left">
               <p className="text-[11px] font-bold text-[#0A1140] group-hover:text-[#1D4ED8] transition-colors leading-tight">{label}</p>
               <p className="text-[9px] font-medium text-slate-400 mt-0.5 tracking-wider uppercase">{sub}</p>
            </div>
         </div>
         <ChevronRight size={14} className="text-slate-300 group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all" />
      </button>
   );
}

function DocItem({ label, date }: any) {
   return (
      <div className="flex items-center justify-between group cursor-pointer">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
               <FileText size={16} />
            </div>
            <div className="min-w-0">
               <p className="text-[11px] font-bold text-[#0A1140] truncate group-hover:text-[#1D4ED8] transition-colors">{label}</p>
               <p className="text-[9px] font-medium text-slate-400 mt-0.5 tracking-wider">{date}</p>
            </div>
         </div>
         <ChevronRight size={14} className="text-slate-300 group-hover:text-[#1D4ED8] transition-all" />
      </div>
   );
}
