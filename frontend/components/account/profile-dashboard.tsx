"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  History,
  Bookmark,
  Settings,
  LogOut,
  Bell,
  Search,
  Upload,
  FilePlus,
  UserPlus,
  FileText,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Eye,
  ArrowRight,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line
} from "recharts";

// Simulated Data sets
const mainSpendData = [
  { name: '16.02', placed: 200000, estimated: 240000 },
  { name: '17.02', placed: 230000, estimated: 210000 },
  { name: '21.02', placed: 180000, estimated: 200000 },
  { name: '21.02', placed: 250000, estimated: 280000 },
  { name: '21.02', placed: 290000, estimated: 260000 },
  { name: '22.02', placed: 260000, estimated: 220000 },
];

const categorySpendData = [
  { name: 'Sand', value: 45, color: '#f97316' },
  { name: 'Cement', value: 25, color: '#3b82f6' },
  { name: 'Rebars', value: 20, color: '#10b981' },
  { name: 'Finishing', value: 10, color: '#6366f1' },
];

const supplierDistributionData = [
  { day: 'Mon', score: 2 },
  { day: 'Tue', score: 3 },
  { day: 'Wed', score: 4 },
  { day: 'Thu', score: 5 },
  { day: 'Fri', score: 2.5 },
  { day: 'Sat', score: 4.5 },
];

const orderActivityData = [
  { day: 'Mon', active: 5 },
  { day: 'Tue', active: 8 },
  { day: 'Wed', active: 10 },
  { day: 'Thu', active: 6 },
  { day: 'Fri', active: 11 },
  { day: 'Sat', active: 9 },
];

const ordersHistory = [
  { id: 'PRO102563', supplier: 'Traxus Industrial', total: 'N80,000', date: 'Mar 1, 2024', status: 'Processing', color: 'orange' },
  { id: 'PRO102567', supplier: 'Gibson Holdings', total: 'N45,000', date: 'Mar 1, 2024', status: 'In Progress', color: 'blue' },
  { id: 'PRO102541', supplier: 'Halcyon Supplies', total: 'N85,000', date: 'Mar 1, 2024', status: 'Delivered', color: 'green' },
  { id: 'PRO102532', supplier: 'Primelogic Systems', total: 'N85,000', date: 'Mar 1, 2024', status: 'Canceled', color: 'red' },
];

export default function ProfileDashboard({ user: initialUser }: { user: any }) {
  const { user, logout, refreshUser } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "wallet" | "history" | "saved" | "settings">("dashboard");
  const [accountOrders, setAccountOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [settingsForm, setSettingsForm] = useState({ fullName: user?.fullName || "", email: user?.email || "" });
  const [updatingSettings, setUpdatingSettings] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (activeTab === "orders" || activeTab === "history") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getAccountOrders();
      setAccountOrders(data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    try {
      await api.updateProfile(settingsForm);
      await refreshUser();
      alert("Profile updated successfully!");
    } catch (e: any) {
      alert(e.message || "Failed to update profile.");
    } finally {
      setUpdatingSettings(false);
    }
  };

  if (!hasMounted) {
    return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans text-slate-800">
      
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-8">
        
        {/* Breadcrumb Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-8 flex items-center text-[12px] font-bold tracking-wide">
           <span className="text-slate-400">Home</span> 
           <span className="text-slate-300 mx-2">/</span> 
           <span className="text-slate-400">pages</span> 
           <span className="text-slate-300 mx-2">/</span> 
           <span className="text-[#0B1332] uppercase">{activeTab.replace("-", " ")}</span>
        </div>

        {/* 3-Column Super Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8">
          
          {/* COLUMN 1: LEFT NAV SIDEBAR */}
          <aside className="bg-[#0B1332] text-white rounded-[2rem] flex flex-col overflow-hidden shadow-xl self-start sticky top-8">
            <div className="p-8 pb-4">
              <Link href="/" className="group block">
                <h2 className="text-2xl font-black tracking-tight mb-8 group-hover:text-[#1D4ED8] transition-colors">Procurely<span className="text-[10px]">&trade;</span></h2>
              </Link>
              
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/10 shrink-0 bg-white/5 flex items-center justify-center text-white font-black text-xl">
                    {user?.fullName?.charAt(0)}
                 </div>
                 <div className="min-w-0">
                    <p className="font-bold text-[13px] truncate">{user?.fullName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1D4ED8]">{user?.role || "Global Partner"}</p>
                 </div>
              </div>

              <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 px-2">Identity Hub</div>
            </div>

            <nav className="flex flex-col px-4 pb-8 space-y-1">
               <SidebarItem 
                 icon={<LayoutDashboard size={18} />} 
                 label="My Dashboard" 
                 active={activeTab === "dashboard"} 
                 onClick={() => setActiveTab("dashboard")} 
               />
               <SidebarItem 
                 icon={<ShoppingCart size={18} />} 
                 label="Orders" 
                 active={activeTab === "orders"} 
                 onClick={() => setActiveTab("orders")} 
               />
               <SidebarItem 
                 icon={<Wallet size={18} />} 
                 label="Wallet / Payments" 
                 active={activeTab === "wallet"} 
                 onClick={() => setActiveTab("wallet")} 
               />
               <SidebarItem 
                 icon={<History size={18} />} 
                 label="Order History" 
                 active={activeTab === "history"} 
                 onClick={() => setActiveTab("history")} 
               />
               <SidebarItem 
                 icon={<Bookmark size={18} />} 
                 label="Saved Materials" 
                 active={activeTab === "saved"} 
                 onClick={() => setActiveTab("saved")} 
               />
               <SidebarItem 
                 icon={<Settings size={18} />} 
                 label="Account Settings" 
                 active={activeTab === "settings"} 
                 onClick={() => setActiveTab("settings")} 
               />
               <div className="pt-4 mt-4 border-t border-white/5">
                 <SidebarItem 
                   icon={<LogOut size={18} className="text-rose-400" />} 
                   label="Logout" 
                   onClick={logout} 
                 />
               </div>
            </nav>
          </aside>

          {/* COLUMN 2+: CONTENT SWITCHER */}
          <main className="flex flex-col space-y-8 min-w-0">
             
             {/* Header Title Bar */}
             <div className="flex justify-between items-start pt-2">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#1D4ED8] mb-1">
                    {activeTab === "dashboard" ? `Hello ${user?.fullName.split(' ')[0]}!` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h1>
                  <p className="text-xs font-bold text-slate-500">
                    {activeTab === "dashboard" ? "Welcome back. Maintain your procurement." : `Manage your ${activeTab} and preferences.`}
                  </p>
                </div>
                <div className="flex gap-3">
                   <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-[#FF5C00] shadow-sm hover:bg-slate-50">
                      <Bell size={18} />
                   </button>
                   <button onClick={() => setActiveTab("settings")} className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-sm hover:bg-slate-50">
                      <Settings size={18} />
                   </button>
                </div>
             </div>

             {activeTab === "dashboard" && (
                <>
                  {/* 3 Metric Cards row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <MetricCard label="Orders" value="124" trend="-10%" color="blue" />
                      <MetricCard label="Request" value="30" trend="+6 new" color="emerald" />
                      <MetricCard label="Savings" value="N4.2M" trend="-2% c/s" color="orange" />
                  </div>

                  {/* Procurement Spend Chart */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                      <h3 className="text-sm font-bold text-[#0B1332] mb-8">Procurement Spend Overview</h3>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={mainSpendData}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                             <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `N${val / 1000}k`} />
                             <Tooltip />
                             <Area type="monotone" dataKey="placed" stroke="#FF5C00" strokeWidth={3} fill="#FF5C00" fillOpacity={0.05} />
                             <Area type="monotone" dataKey="estimated" stroke="#1D4ED8" strokeWidth={3} fill="#1D4ED8" fillOpacity={0.05} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Quick Look Orders */}
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-sm font-bold text-[#FF5C00]">Active Orders</h2>
                      <button onClick={() => setActiveTab("orders")} className="text-[11px] font-bold text-[#1D4ED8] hover:underline">View All</button>
                    </div>
                    <OrdersTable orders={ordersHistory.slice(0, 3)} />
                  </div>
                </>
             )}

             {(activeTab === "orders" || activeTab === "history") && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h2 className="text-xl font-bold text-[#0B1332] mb-6">{activeTab === "orders" ? "Active Procurement" : "Order History"}</h2>
                  {loadingOrders ? (
                    <div className="py-20 text-center text-slate-400 font-bold">Fetching secure ledger...</div>
                  ) : accountOrders.length > 0 ? (
                    <OrdersTable orders={accountOrders} />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-slate-400 font-bold mb-4">No records found in your procurement history.</p>
                      <Link href="/materials" className="inline-flex h-12 items-center px-8 bg-[#1D4ED8] text-white rounded-xl font-bold text-sm">Start Procuring</Link>
                    </div>
                  )}
                </div>
             )}

             {activeTab === "settings" && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-12">
                   <h2 className="text-xl font-bold text-[#0B1332] mb-8">Account Configuration</h2>
                   <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Full Name</label>
                         <input 
                           type="text" 
                           value={settingsForm.fullName}
                           onChange={(e) => setSettingsForm({...settingsForm, fullName: e.target.value})}
                           className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-[#0B1332] focus:ring-2 focus:ring-[#1D4ED8] transition-all" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Email</label>
                         <input 
                           type="email" 
                           value={settingsForm.email}
                           onChange={(e) => setSettingsForm({...settingsForm, email: e.target.value})}
                           className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-[#0B1332] focus:ring-2 focus:ring-[#1D4ED8] transition-all" 
                         />
                      </div>
                      <button 
                        type="submit" 
                        disabled={updatingSettings}
                        className="h-14 px-10 bg-[#1D4ED8] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-[#0B1332] transition-all disabled:opacity-50"
                      >
                        {updatingSettings ? "Synching..." : "Secure Save"}
                      </button>
                   </form>
                </div>
             )}

             {activeTab === "wallet" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-gradient-to-br from-[#1D4ED8] to-[#0B1332] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-20"><Wallet size={80} /></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">Verified Balance</p>
                      <h2 className="text-4xl font-black tracking-tight mb-10">N1,250,500.00</h2>
                      <div className="flex gap-4">
                         <button className="h-12 px-6 bg-white text-[#1D4ED8] rounded-xl font-bold text-xs">Top Up</button>
                         <button className="h-12 px-6 bg-white/10 text-white rounded-xl font-bold text-xs border border-white/20">Withdraw</button>
                      </div>
                   </div>
                   <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-[#0B1332] mb-6">Linked Accounts</h3>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <div className="size-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white"><CreditCard size={20} /></div>
                         <div>
                            <p className="text-xs font-bold text-[#0B1332]">VFD Microfinance Bank</p>
                            <p className="text-[10px] font-medium text-slate-400">**** 8842</p>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "saved" && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center py-24">
                   <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <Bookmark size={40} />
                   </div>
                   <h2 className="text-xl font-bold text-[#0B1332] mb-2">Your Saved Materials</h2>
                   <p className="text-sm font-medium text-slate-400 mb-8">Items saved for future procurement appear here.</p>
                   <Link href="/wishlist" className="text-[#1D4ED8] font-bold underline">Go to Wishlist &rarr;</Link>
                </div>
             )}

          </main>
        </div>
      </div>
    </div>
  );
}

// --- Specific Components ---
function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold ${
       active ? "bg-[#1D4ED8] text-white shadow-md shadow-blue-900/50" : "text-white/60 hover:text-white hover:bg-white/10"
    }`}>
      <div className="flex items-center gap-4">
        <span>{icon}</span>
        <span className="text-[13px]">{label}</span>
      </div>
    </button>
  );
}

function MetricCard({ label, value, trend, color }: any) {
   const colors: any = {
      blue: "text-blue-500 bg-blue-50",
      emerald: "text-emerald-500 bg-emerald-50",
      orange: "text-orange-500 bg-orange-50"
   };
   return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
         <div className="w-16 h-12 shrink-0 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={[{v:2},{v:5},{v:3},{v:8},{v:5},{v:9}]} >
                  <Line type="monotone" dataKey="v" stroke="currentColor" strokeWidth={2} dot={false} className={colors[color].split(' ')[0]} />
               </LineChart>
            </ResponsiveContainer>
         </div>
         <div>
            <div className="flex items-end gap-2">
               <h3 className="text-2xl font-black text-[#0B1332]">{value}</h3>
               <span className="text-xs font-bold text-[#0B1332] mb-1">{label}</span>
               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 mb-1 ${colors[color]}`}>{trend}</span>
            </div>
         </div>
      </div>
   );
}

function OrdersTable({ orders }: { orders: any[] }) {
   return (
      <div className="overflow-x-auto w-full">
         <table className="w-full text-left">
            <thead>
               <tr className="text-[11px] font-bold text-[#0B1332] border-b border-slate-100">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Total Amount</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {orders.map((order) => (
                  <tr key={order.order_number || order.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 px-2">
                        <p className="text-[13px] font-bold text-[#0B1332]">#{order.order_number || order.id}</p>
                     </td>
                     <td className="py-4 px-2">
                        <p className="text-[13px] font-bold text-[#0B1332]">N{(order.total / 100).toLocaleString()}</p>
                     </td>
                     <td className="py-4 px-2">
                        <p className="text-[13px] font-bold text-[#0B1332]">{order.created_at ? new Date(order.created_at).toLocaleDateString() : order.date}</p>
                     </td>
                     <td className="py-4 px-2">
                        <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold items-center gap-1.5 ${
                           order.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'paid' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                           {order.status || 'Processing'}
                        </span>
                     </td>
                     <td className="py-4 px-2 text-right">
                        <button className="w-8 h-8 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors">
                           <Eye size={14} />
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
