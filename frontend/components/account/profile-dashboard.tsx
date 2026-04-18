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
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line
} from "recharts";
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
  { name: 'Cement', value: 25, color: '#1D4ED8' },
  { name: 'Rebars', value: 20, color: '#10B981' },
  { name: 'Finishing', value: 10, color: '#6366f1' },
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
        


        {/* Top Metric Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[13px] max-w-[866px] w-full mb-2">
           <MetricCard 
             label="Orders" 
             value="124" 
             trend="+10%" 
             sub="In the last" 
             subAction="10 Weeks"
             color="blue" 
             data={[{v:20},{v:45},{v:30},{v:50},{v:40},{v:60}]}
           />
           <MetricCard 
             label="Request" 
             value="30" 
             trend="+3 new" 
             sub="+3 new today" 
             color="green" 
             data={[{v:10},{v:30},{v:20},{v:60},{v:40},{v:80}]}
           />
           <MetricCard 
             label="Savings" 
             value="₦4.2M" 
             trend="-5% c/s" 
             sub="Total cost savings" 
             color="orange" 
             data={[{v:50},{v:40},{v:60},{v:30},{v:70},{v:40}]}
           />
        </div>

        {/* Order Overview Section */}
        <section 
          className="bg-white p-6 relative overflow-hidden flex flex-col justify-between"
          style={{
            width: '673.69px',
            height: '247.79px',
            borderRadius: '6.19px',
            boxShadow: '0px 5.81px 23.24px 0px #3326AE14',
            border: 'none'
          }}
        >
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[16px] font-extrabold text-[#0C1457] tracking-tight">Order Overview</h3>
              <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg">
                 {['1W', '1M', '3M'].map((tab, idx) => (
                    <button key={tab} className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all ${idx === 0 ? 'bg-white text-[#1D4ED8] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                       {tab}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex justify-center gap-6 mb-2 text-[11px] font-bold">
              <span className="flex items-center gap-2 text-orange-500">
                <div className="w-2 h-2 rounded-full bg-orange-500" /> Income
              </span>
              <span className="flex items-center gap-2 text-blue-600">
                <div className="w-2 h-2 rounded-full bg-blue-600" /> Outcome
              </span>
           </div>

           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={spendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.05}/>
                          <stop offset="95%" stopColor="#FF5C00" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.05}/>
                          <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} 
                       tickFormatter={(v) => `N${v/1000}k`}
                    />
                    <Tooltip cursor={{ stroke: '#00D1FF', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area 
                      type="monotone" 
                      dataKey="payments" 
                      stroke="#FF5C00" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                      dot={{r: 4, fill: '#FF5C00', strokeWidth: 2, stroke: '#fff'}}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#1D4ED8" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorOutcome)" 
                      dot={{r: 4, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff'}}
                      activeDot={{ r: 6, strokeWidth: 0 }}
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
           <div 
              className="bg-white relative flex flex-col justify-between"
              style={{
                width: '376px',
                height: '320px',
                padding: '15px',
                borderRadius: '6.19px',
                boxShadow: '0px 5.81px 23.24px 0px #3326AE14',
                border: 'none'
              }}
           >
              <h3 className="text-[16px] font-extrabold text-[#0C1457] tracking-tight mb-4">Supplier Distribution</h3>
              <div className="flex-1 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                       <XAxis 
                          dataKey="day" 
                          axisLine={{ stroke: '#E2E8F0' }} 
                          tickLine={false} 
                          tick={{fill: '#94A3B8', fontSize: 13, fontWeight: 500}} 
                          dy={10} 
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 500}}
                          tickFormatter={(v, index) => `${5 - index} stars`}
                          ticks={[100, 80, 60, 40]}
                       />
                       <Bar 
                          dataKey="count" 
                          radius={[6, 6, 6, 6]} 
                          barSize={24}
                       >
                          {supplierData.map((entry, index) => (
                            <Cell 
                               key={`cell-${index}`} 
                               fill={index % 3 === 0 ? '#3B82F6' : index % 3 === 1 ? '#60A5FA' : '#93C5FD'} 
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
           {/* Order Activity */}
           <div className="bg-white rounded-[8px] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                 <h4 className="text-[13px] font-black text-[#0A1140] uppercase tracking-wider mb-2">Order Activity</h4>
                 <p className="text-[11px] font-medium text-slate-400">Projected volume vs Actuals</p>
              </div>
              <div className="w-32 h-14 opacity-40">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{v:40},{v:70},{v:50},{v:90},{v:60}]}>
                       <Bar dataKey="v" fill="#1D4ED8" radius={2} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Delivery Performance */}
           <div className="bg-white rounded-[8px] p-6 shadow-sm border border-slate-100">
              <h4 className="text-[13px] font-black text-[#0A1140] uppercase tracking-wider mb-4">Delivery Performance</h4>
              <div className="flex items-center gap-4">
                 <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#10B981] w-[33%]" />
                    <div className="h-full bg-[#FF5C00] w-[67%]" />
                 </div>
                 <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest shrink-0">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10B981]" /> 33% On-Time</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF5C00]" /> 67% Delayed</span>
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
  );
}

// --- Internal Helper Components ---

function MetricCard({ label, value, trend, sub, color, data, subAction }: any) {
   const variants: any = {
      blue: { stroke: "#7C3AED", bg: "bg-blue-50 text-blue-600" }, // Purple for Orders
      green: { stroke: "#10B981", bg: "bg-emerald-50 text-emerald-600" },
      orange: { stroke: "#FF5C00", bg: "bg-orange-50 text-orange-600" }
   };
   
   return (
      <div className="bg-white rounded-[8px] p-4 flex items-center gap-4 h-[108px] border border-slate-50 transition-all hover:shadow-md">
         {/* Sparkline on the Left */}
         <div className="w-[100px] h-[60px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                  <Line 
                    type="monotone" 
                    dataKey="v" 
                    stroke={variants[color].stroke} 
                    strokeWidth={2.5} 
                    dot={false} 
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>

         {/* Content on the Right */}
         <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
               <h3 className="text-[28px] font-black text-[#0C1457] tracking-tighter leading-none">{value}</h3>
               <span className="text-[16px] font-bold text-[#0C1457]">{label}</span>
               {trend && (
                 <span className={`text-[12px] font-bold ml-auto ${trend.startsWith('+') ? 'text-blue-600' : 'text-orange-500'}`}>
                   {trend}
                 </span>
               )}
            </div>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[12px] font-medium text-slate-400 capitalize whitespace-nowrap">{sub}</p>
               {subAction && (
                 <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-tighter whitespace-nowrap">
                   {subAction}
                 </span>
               )}
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
