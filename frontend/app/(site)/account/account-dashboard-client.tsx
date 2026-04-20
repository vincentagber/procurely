"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
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
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Gift,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  FileDown,
  Filter,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Mail,
  User as UserIcon,
  Heart,
  ShoppingBag
} from "lucide-react";

import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { DashboardTools } from "@/components/account/dashboard-tools";
import { useAuth } from "@/components/auth/auth-provider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";

// Mock Data matching Figma design
const spendData = [
  { name: '16.02', spend1: 300, spend2: 380 },
  { name: '17.02', spend1: 450, spend2: 340 },
  { name: '21.02', spend1: 380, spend2: 480 },
  { name: '21.02', spend1: 520, spend2: 390 },
  { name: '21.02', spend1: 420, spend2: 550 },
  { name: '22.02', spend1: 350, spend2: 420 },
];

const categoryData = [
  { name: 'Sand', value: 45, color: '#FF7D00' },
  { name: 'Cement', value: 25, color: '#1D4ED8' },
  { name: 'Rebars', value: 20, color: '#3182CE' },
  { name: 'Finishing', value: 10, color: '#CBD5E0' },
];

const supplierData = [
  { name: 'Tue', value: 4 },
  { name: 'Thu', value: 6 },
  { name: 'Fri', value: 3.5 },
  { name: 'Sat', value: 4.5 },
];

const activityData = [
  { name: 'Tue', value: 32 },
  { name: 'Thu', value: 54 },
  { name: 'Fri', value: 47 },
  { name: 'Sat', value: 51 },
];

export default function AccountDashboardClient() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await api.getAccountOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'delivered' || s === 'paid') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'processing' || s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (s === 'canceled' || s === 'cancelled') return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-2 pb-6 border-b border-slate-200">
        <div 
          className="flex flex-col w-full"
          style={{ maxWidth: '886px', minHeight: '76.10px', gap: '8px' }}
        >
          <h1 className="text-4xl font-extrabold text-[#0001FF] tracking-tight m-0 leading-none">Hello {user?.roles?.includes('admin') ? 'Admin' : (user?.fullName?.split(' ')[0] || 'Admin')}!</h1>
          <p className="text-[14px] font-medium text-slate-400 m-0 leading-tight">Welcome back, lets manage your procurement.</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <button className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group hover:bg-slate-50 hover:shadow-md transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_229.97px] gap-[40px]">
        {/* Main Content (Left) */}
        <div className="space-y-[18px] min-w-0">
          
          {/* Top Stat Cards Row */}
          <div className="flex flex-col sm:flex-row gap-[10.11px] w-full">
            {/* Stat Card 1 */}
            <div className="flex-1 h-[84px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between overflow-hidden">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-2xl font-black text-[#0A1140]">124</span>
                     <span className="text-[12px] font-bold text-slate-500">Orders</span>
                     <span className="text-[10px] font-bold text-[#1D4ED8] bg-blue-50 px-1.5 py-0.5 rounded">-10%</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In the last 10 weeks</p>
               </div>
               <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:10},{v:50},{v:30},{v:40},{v:60},{v:40}]}>
                       <Line type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Stat Card 2 */}
            <div className="flex-1 h-[84px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between overflow-hidden">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-2xl font-black text-[#0A1140]">30</span>
                     <span className="text-[12px] font-bold text-slate-500">Request</span>
                     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+3 new today</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+3 new today</p>
               </div>
               <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:20},{v:40},{v:25},{v:50},{v:35},{v:60}]}>
                       <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Stat Card 3 */}
            <div className="flex-1 h-[84px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between overflow-hidden">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-2xl font-black text-[#0A1140]">₦4.2M</span>
                     <span className="text-[12px] font-bold text-slate-500">Total savings</span>
                     <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">-5% c/s</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total cost savings</p>
               </div>
               <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:50},{v:30},{v:45},{v:20},{v:40},{v:35}]}>
                       <Line type="monotone" dataKey="v" stroke="#F43F5E" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* PROCUREMENT SPEND OVERVIEW */}
          <div className="w-full min-h-[247.79px] bg-white rounded-[6.19px] p-6 border border-slate-100 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-black text-[#0A1140]">Procurement Spend Overview</h3>
                <div className="flex items-center gap-2">
                   <div className="flex bg-slate-50 rounded-lg p-1">
                      <button className="px-3 py-1 text-[10px] font-bold text-[#0A1140] bg-white shadow-sm rounded-md">7 Days</button>
                      <button className="px-3 py-1 text-[10px] font-bold text-slate-400">30 Days</button>
                      <button className="px-3 py-1 text-[10px] font-bold text-slate-400">90 Days</button>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={spendData}>
                      <defs>
                        <linearGradient id="colorSpend1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF5C00" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#FF5C00" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSpend2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="spend1" stroke="#FF5C00" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend1)" dot={{ r: 4, fill: '#FF5C00', strokeWidth: 2, stroke: '#fff' }} />
                      <Area type="monotone" dataKey="spend2" stroke="#1D4ED8" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend2)" dot={{ r: 4, fill: '#1D4ED8', strokeWidth: 2, stroke: '#fff' }} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>

             <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#FF5C00]" />
                   <span className="text-[10px] font-bold text-slate-500">Orders Placed</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                   <span className="text-[10px] font-bold text-slate-500">Payments Made</span>
                </div>
             </div>
          </div>

          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
             {/* Material Category Spend */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm col-span-1 flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-black text-[#13184F] whitespace-nowrap">Material Category Spend</h3>
                    <div className="flex gap-1 bg-[#E7E8EE] rounded-lg p-1">
                       <button className="px-2 py-1 text-[9px] font-bold bg-white rounded shadow-sm">1W</button>
                       <button className="px-2 py-1 text-[9px] font-bold text-slate-500">1M</button>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 flex-1">
                    <div className="h-44 w-1/2 relative">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                             <Pie
                               data={categoryData}
                               cx="50%"
                               cy="50%"
                               innerRadius={45}
                               outerRadius={65}
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
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                          <div className="text-[16px] font-black text-[#13184F]">82%</div>
                       </div>
                    </div>
                    <div className="space-y-3 w-1/2">
                       {categoryData.map(item => (
                         <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                               <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}} />
                               <span className="text-[11px] font-bold text-slate-500">{item.name}</span>
                            </div>
                            <span className="text-[11px] font-black text-[#13184F]">{item.value}%</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Supplier Distribution */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm col-span-1">
                 <h3 className="text-[13px] font-black text-[#13184F] mb-6">Supplier Distribution</h3>
                 <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={supplierData}>
                          <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={16} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold', fill: '#94A3B8'}} tickFormatter={(v) => `${v} stars`} width={35} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Order Activity */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm col-span-1">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[13px] font-black text-[#13184F]">Order Activity</h3>
                    <div className="flex gap-1 bg-[#E7E8EE] rounded-lg p-1">
                       <button className="px-2 py-1 text-[9px] font-bold bg-white rounded shadow-sm">1W</button>
                       <button className="px-2 py-1 text-[9px] font-bold text-slate-500">1M</button>
                    </div>
                 </div>
                 <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={activityData}>
                          <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={20} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94A3B8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold', fill: '#94A3B8'}} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Delivery Performance */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm col-span-1">
                 <h3 className="text-[13px] font-black text-[#13184F] mb-8">Delivery Performance</h3>
                 <div className="flex gap-10 items-end justify-center mb-8 h-20">
                    <div className="flex flex-col items-center gap-1 w-full max-w-[32px]">
                       <div className="w-full bg-[#10B981]/10 rounded-full h-12 relative overflow-hidden">
                         <div className="absolute bottom-0 w-full bg-[#36D1B2] h-[23%]" />
                       </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 w-full max-w-[32px]">
                       <div className="w-full bg-[#FF7D00]/10 rounded-full h-16 relative overflow-hidden">
                         <div className="absolute bottom-0 w-full bg-[#FF9F0A] h-[57%]" />
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center justify-center gap-10">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#36D1B2]" />
                       <span className="text-[11px] font-bold text-slate-500">On-Time <span className="text-[#13184F] font-black ml-1">23%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#FF9F0A]" />
                       <span className="text-[11px] font-bold text-slate-500">Delayed <span className="text-[#13184F] font-black ml-1">57%</span></span>
                    </div>
                 </div>
              </div>
          </div>

          {/* Orders History Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-black text-[#FF5C00]">Orders History</h3>
                <Link href="#" className="text-[11px] font-black text-[#1D4ED8] flex items-center gap-1 hover:underline">
                   More <ChevronRight size={14} />
                </Link>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-50">
                         <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Order ID</th>
                         <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Supplier</th>
                         <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Total Amount</th>
                         <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Date Placed</th>
                         <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-center">Delivery Status</th>
                         <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        <tr><td colSpan={6} className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Ledger...</td></tr>
                      ) : orders.length > 0 ? (
                        orders.slice(0, 5).map(order => (
                          <tr key={order.order_number} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-4">
                                <p className="text-[12px] font-black text-[#0A1140]">{order.order_number}</p>
                                <p className="text-[9px] font-bold text-slate-400">{order.uuid?.slice(0,8)}</p>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-[12px] font-black text-[#0A1140]">{order.shipping_name || "Partner"}</p>
                                <p className="text-[9px] font-bold text-slate-400">{order.items?.length || 0} items supplied</p>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-[12px] font-black text-[#0A1140]">₦{(order.total / 100).toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-slate-400">Total including fees</p>
                             </td>
                             <td className="px-6 py-4">
                                <p className="text-[12px] font-black text-[#0A1140]">{new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-[9px] font-bold text-slate-400">{new Date(order.created_at).toLocaleTimeString()}</p>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border ${getStatusColor(order.status)}`}>
                                   <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                   {order.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-slate-300 hover:text-[#1D4ED8]">
                                   <MoreHorizontal size={18} />
                                </button>
                             </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={6} className="py-10 text-center text-slate-400 font-bold uppercase tracking-widest">No recent activity.</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
           
           {/* My Profile Widget */}
           <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-6">
                 <h3 className="text-[12px] font-black text-[#0A1140]">My profile</h3>
                 <div className="flex gap-2 text-slate-400">
                    <button className="hover:text-[#1D4ED8]"><Settings size={14} /></button>
                 </div>
              </div>
              <div className="w-24 h-24 rounded-full border-[6px] border-[#F8F9FA] overflow-hidden mb-4 shadow-inner ring-2 ring-slate-100">
                 <img src="/api/placeholder/100/100" className="w-full h-full object-cover" alt="Profile" />
              </div>
              <h4 className="text-[14px] font-black text-[#0A1140]">{user?.fullName || 'Olusegun Akapo'}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Procurement Manager</p>
              
              <div className="mt-8 mb-8 border-t border-slate-100 w-full" />
              
              <div className="w-full">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500">Profile Completion</span>
                    <span className="text-[10px] font-black text-[#0A1140]">70</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF5C00] h-full w-[70%]" />
                 </div>
              </div>
           </div>

           {/* Unified Activity, Tools & Documents Block */}
           <DashboardTools />

      </div>
    </div>
  </div>
  );
}
