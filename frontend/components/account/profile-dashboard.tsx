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
  LayoutDashboard
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line
} from "recharts";
import { motion } from "framer-motion";

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
  { id: 'PRO102563', supplier: 'Traxus Industrial', total: 'N80,000', date: 'Mar 1, 2024', status: 'Processing', color: 'orange' },
  { id: 'PRO102567', supplier: 'Gibson Holdings', total: 'N45,000', date: 'Mar 1, 2024', status: 'In Progress', color: 'blue' },
  { id: 'PRO102541', supplier: 'Halcyon Supplies', total: 'N85,000', date: 'Mar 1, 2024', status: 'Delivered', color: 'green' },
  { id: 'PRO102532', supplier: 'Primelogic Systems', total: 'N85,000', date: 'Mar 1, 2024', status: 'Canceled', color: 'red' },
];

import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";

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
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-[10px] w-full max-w-[1440px] mx-auto min-w-0">
      
      {/* 🚀 CENTRAL CONTENT COLUMN */}
      <div className="space-y-[10px] min-w-0">
        
        {/* Breadcrumb Bar */}
        <div className="bg-white rounded-[8px] border border-slate-100 p-4 mb-2 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
           <span>Home</span> 
           <span className="mx-2 text-slate-200">/</span> 
           <span className="text-slate-400">Account</span> 
           <span className="mx-2 text-slate-200">/</span> 
           <span className="text-slate-400">Account Settings</span> 
           <span className="mx-2 text-slate-200">/</span> 
           <span className="text-[#1D4ED8]">Profile Information</span>
        </div>
        
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-2 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0A1140] tracking-tight">Hello {user?.fullName?.split(' ')[0] || "User"}!</h1>
            <p className="text-[12px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Welcome back. Maintain your procurement.</p>
          </div>
          <div className="flex gap-2">
             <button className="w-10 h-10 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#1D4ED8] transition-colors"><Bell size={18} /></button>
             <button className="w-10 h-10 bg-white rounded-lg border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#1D4ED8] transition-colors"><Settings size={18} /></button>
          </div>
        </div>

        {/* Top Metric Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
           <MetricCard 
             label="Orders" 
             value="124" 
             trend="-10%" 
             sub="in the last 12 weeks" 
             color="blue" 
             data={[{v:20},{v:45},{v:30},{v:50},{v:40},{v:60}]}
           />
           <MetricCard 
             label="Request" 
             value="30" 
             trend="+6 new" 
             sub="+4 new today" 
             color="green" 
             data={[{v:10},{v:30},{v:20},{v:60},{v:40},{v:80}]}
           />
           <MetricCard 
             label="Savings" 
             value="N4.2M" 
             trend="-3% s/s" 
             sub="Total cost savings" 
             color="orange" 
             data={[{v:50},{v:40},{v:60},{v:30},{v:70},{v:40}]}
           />
        </div>

        {/* Spend Overview Large Section */}
        <section className="bg-white rounded-[8px] p-6 lg:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-[14px] font-black text-[#0A1140] uppercase tracking-wider leading-relaxed">Procurement Spend Overview</h3>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF5C00]" /> Orders Placed</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#1D4ED8]" /> Payments Made</span>
                 </div>
                 <select className="text-[11px] font-bold text-slate-500 bg-slate-50 border-none rounded-md px-3 py-1.5 outline-none cursor-pointer">
                    <option>7 Days</option>
                    <option>30 Days</option>
                    <option>90 Days</option>
                 </select>
              </div>
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={spendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#FF5C00" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.1}/>
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
                       dx={-10}
                    />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="orders" stroke="#FF5C00" strokeWidth={3} fillOpacity={1} fill="url(#colorOrders)" dot={{r: 4, fill: '#FF5C00', strokeWidth: 2, stroke: '#fff'}} />
                    <Area type="monotone" dataKey="payments" stroke="#1D4ED8" strokeWidth={3} fillOpacity={1} fill="url(#colorPayments)" dot={{r: 4, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff'}} />
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
           <div className="bg-white rounded-[8px] p-6 lg:p-8 shadow-sm border border-slate-100">
              <h3 className="text-[13px] font-black text-[#0A1140] uppercase tracking-wider mb-8">Supplier Distribution</h3>
              <div className="h-[140px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={supplierData}>
                       <Bar 
                          dataKey="count" 
                          fill="#1D4ED8" 
                          radius={[4, 4, 0, 0]} 
                          barSize={30}
                       >
                          {supplierData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 3 ? '#1D4ED8' : '#DBEAFE'} className="transition-all" />
                          ))}
                       </Bar>
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
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

        {/* Orders History Table */}
        <section className="bg-white rounded-[8px] p-6 lg:p-8 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-[14px] font-black text-[#0A1140] uppercase tracking-wider">Orders History</h3>
              <button className="text-[11px] font-bold text-[#FF5C00] hover:underline flex items-center gap-1.5 transition-all">
                More <ChevronRight size={14} />
              </button>
           </div>
           <div className="overflow-x-auto w-full">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black tracking-[0.2em] text-[#0A1140]/40 uppercase border-b border-slate-100 pb-4">
                       <th className="pb-4 font-black">Order ID</th>
                       <th className="pb-4 font-black">Supplier</th>
                       <th className="pb-4 font-black">Total Amount</th>
                       <th className="pb-4 font-black">Date Placed</th>
                       <th className="pb-4 font-black text-center">Delivery Status</th>
                       <th className="pb-4 font-black text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Fetching ledger...</td></tr>
            ) : orders.length > 0 ? (
              orders.slice(0, 5).map((order, idx) => (
                <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-5">
                      <p className="text-[13px] font-bold text-[#0A1140] mb-0.5">{order.order_number || "ORDER"}</p>
                      <p className="text-[10px] font-medium text-slate-400">{order.uuid?.slice(0,6) || "A83214"}</p>
                    </td>
                    <td className="py-5">
                      <p className="text-[13px] font-bold text-slate-700 mb-0.5">{order.shipping_name || "Partner"}</p>
                      <p className="text-[10px] font-medium text-slate-400">{order.items?.length || 0} Items supplied</p>
                    </td>
                    <td className="py-5">
                      <p className="text-[13px] font-black text-[#0A1140]">N{(order.total / 100).toLocaleString()}</p>
                      <p className="text-[10px] font-medium text-slate-400">Total including fees</p>
                    </td>
                    <td className="py-5 whitespace-nowrap">
                      <p className="text-[13px] font-bold text-slate-700 mb-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] font-medium text-slate-400">{new Date(order.created_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="py-5">
                      <div className="flex justify-center">
                          <StatusBadge 
                            status={order.status.toUpperCase()} 
                            type={order.status === 'paid' ? 'green' : order.status === 'pending' ? 'orange' : 'red'} 
                          />
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                          <button className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#1D4ED8] hover:bg-blue-50 transition-all shadow-sm"><Eye size={16} /></button>
                      </div>
                    </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest">No recent procurement activity.</td></tr>
            )}
          </tbody>
        </table>
           </div>
        </section>

      </div>

      {/* 👤 RIGHT SIDEBAR / PROFILE COLUMN */}
      <aside className="space-y-[10px] hidden xl:block min-w-0">
         
         {/* Profile Card */}
         <div className="bg-white rounded-[8px] p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="flex justify-between w-full mb-6">
                <ChevronRight size={18} className="text-slate-200 rotate-180 cursor-pointer hover:text-slate-400 transition-colors" />
                <Settings size={18} className="text-slate-200 cursor-pointer hover:text-slate-400 transition-colors" />
            </div>
            
            <div className="w-24 h-24 rounded-full p-1.5 border-2 border-slate-50 mb-4 bg-white shadow-inner">
               <div className="w-full h-full rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150" alt="Admin" className="w-full h-full object-cover" />
               </div>
            </div>
            
            <h3 className="text-[18px] font-black text-[#0A1140] mb-0.5 tracking-tight">{user?.fullName || "User Account"}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">{user?.role || "Procurement Manager"}</p>
            
            <div className="w-full bg-slate-50 rounded-full h-1.5 mb-2 overflow-hidden">
               <div className="bg-[#1D4ED8] h-full w-[70%] rounded-full shadow-[0_0_8px_rgba(29,78,216,0.3)]" />
            </div>
            <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-widest text-[#0A1140]/40">
               <span>Profile Completion</span>
               <span>70</span>
            </div>
         </div>

         {/* Activity Summary */}
         <div className="bg-white rounded-[8px] p-6 shadow-sm border border-slate-100">
            <h4 className="text-[12px] font-black text-[#0A1140] uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Activity Summary</h4>
            <div className="space-y-4">
               <ActivityItem icon={<FileText size={14} />} label="Total orders" count={orders.length} color="orange" />
               <ActivityItem icon={<Package size={14} />} label="Active orders" count={activeOrders} color="blue" />
               <ActivityItem icon={<Clock size={14} />} label="Completed orders" count={completedOrders} color="emerald" />
               <ActivityItem icon={<ShoppingCart size={14} />} label="Recent actions" count={0} color="amber" />
            </div>
         </div>

         {/* Quick Tools */}
         <div className="bg-white rounded-[8px] p-6 shadow-sm border border-slate-100">
            <h4 className="text-[12px] font-black text-[#0A1140] uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Quick Tools</h4>
            <div className="space-y-3">
               <ToolItem icon={<Upload size={16} />} label="Upload BoQ Document" sub="PDF, XLS" />
               <ToolItem icon={<FilePlus size={16} />} label="Create New RFQ" sub="RFQ" />
               <ToolItem icon={<UserPlus size={16} />} label="Add New Supplier" sub="KYC" />
            </div>
         </div>

         {/* Recent Documents */}
         <div className="bg-white rounded-[8px] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
               <h4 className="text-[12px] font-black text-[#0A1140] uppercase tracking-widest">Recent Documents</h4>
               <button className="text-[10px] font-bold text-[#FF5C00] hover:underline">View All</button>
            </div>
            <div className="space-y-4">
               <DocItem label="BoQ Material.xls" date="34 KB" />
               <DocItem label="Invoice_084.pdf" date="1.2 MB" />
            </div>
         </div>

      </aside>

    </div>
  );
}

// --- Internal Helper Components ---

function MetricCard({ label, value, trend, sub, color, data }: any) {
   const variants: any = {
      blue: { stroke: "#1D4ED8", bg: "bg-blue-50 text-blue-600" },
      green: { stroke: "#10B981", bg: "bg-emerald-50 text-emerald-600" },
      orange: { stroke: "#FF5C00", bg: "bg-orange-50 text-orange-600" }
   };
   
   return (
      <div className="bg-white rounded-[8px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[110px] hover:shadow-md transition-shadow">
         <div className="flex justify-between items-start">
            <div className="flex items-end gap-3">
               <h3 className="text-3xl font-black text-[#0A1140] tracking-tight">{value}</h3>
               <div className="pb-1.5 flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-slate-800">{label}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${variants[color].bg}`}>{trend}</span>
               </div>
            </div>
            <div className="w-16 h-8 opacity-40">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                     <Line type="monotone" dataKey="v" stroke={variants[color].stroke} strokeWidth={2} dot={false} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
         <p className="text-[11px] font-bold text-slate-400 mt-2">{sub}</p>
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
