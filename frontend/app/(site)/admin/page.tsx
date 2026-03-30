"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Package, 
  ChevronRight, 
  Search,
  Bell,
  ArrowUpRight,
  TrendingUp,
  Settings,
  ShieldCheck,
  CreditCard,
  Filter,
  MoreVertical,
  LogOut,
  UserCircle
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "users">("overview");
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setFetching(true);
    try {
      const [s, o, u] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(10),
        api.getAdminUsers(10)
      ]);
      setStats(s);
      setOrders(o);
      setUsers(u);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const handleUpdateStatus = async (orderNumber: string, status: string) => {
    try {
      await api.updateOrderStatus(orderNumber, status);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-blue-500 border-t-transparent" />
            <p className="text-[10px] font-black text-primary-navy-400 uppercase tracking-[0.2em]">Authenticating...</p>
        </div>
      </div>
    );
  }

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-primary-navy-900 font-body antialiased">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-full lg:w-72 bg-white border-r border-neutral-200 flex flex-col z-50">
          <div className="p-8 pb-4">
             <div className="flex items-center gap-3 mb-10">
                <div className="h-9 w-9 bg-primary-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-blue-100">
                   <ShieldCheck size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-primary-navy-900 font-display">Procurely <span className="text-primary-blue-500 font-medium">Admin</span></span>
             </div>

             <nav className="space-y-1.5">
                <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">Main Console</p>
                {[
                  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                  { id: "orders", label: "Orders", icon: ShoppingBag },
                  { id: "users", label: "Customers", icon: Users },
                ].map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                      activeTab === item.id 
                      ? "bg-primary-blue-50 text-primary-blue-600" 
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-primary-navy-900"
                    }`}
                  >
                    <item.icon size={18} className={activeTab === item.id ? "text-primary-blue-600" : "text-neutral-400"} />
                    {item.label}
                  </button>
                ))}
             </nav>
          </div>

          <div className="mt-auto p-6 space-y-4">
             <button 
               onClick={logout}
               className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
             >
                <LogOut size={18} />
                Logout Session
             </button>

             <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="h-9 w-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-primary-navy-900 text-xs font-black shadow-sm">
                   {user.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-bold text-primary-navy-900 truncate leading-tight">{user.fullName}</p>
                   <p className="text-[10px] text-neutral-400 truncate tracking-tight uppercase font-black tracking-[0.1em]">{user.role}</p>
                </div>
             </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-8 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-40">
             <div className="flex-1 flex items-center gap-8">
                <h2 className="text-2xl font-black text-primary-navy-900 capitalize tracking-tight font-display hidden xl:block">
                   {activeTab}
                </h2>
                {/* LARGE LONG SEARCH BAR */}
                <div className="relative group w-full max-w-2xl">
                   <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-blue-500 transition-colors" />
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={`Search ${activeTab === 'overview' ? 'platform wide' : activeTab}...`}
                     className="h-12 w-full rounded-xl bg-neutral-100 border-none px-12 text-[13px] font-bold focus:ring-2 focus:ring-primary-blue-100 focus:bg-white transition-all placeholder:text-neutral-400 shadow-sm"
                   />
                </div>
             </div>

             <div className="flex items-center gap-6 ml-8">
                <button className="relative text-neutral-400 hover:text-primary-navy-900 transition-colors p-2 rounded-lg hover:bg-neutral-50">
                   <Bell size={22} />
                   <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white ring-2 ring-red-500/10" />
                </button>
                <div className="h-8 w-[1px] bg-neutral-200" />
                <button 
                   onClick={logout}
                   className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-neutral-500 hover:text-red-600 transition-colors"
                >
                   <LogOut size={16} />
                   Logout
                </button>
             </div>
          </header>

          <div className="p-8 lg:p-12">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" {...fadeIn} className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                     <div>
                        <h3 className="text-sm font-black text-neutral-400 uppercase tracking-[0.15em] mb-1 italic">Realtime Analytics</h3>
                        <p className="text-lg font-bold text-primary-navy-900 leading-none">Global Logistics Console</p>
                     </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Total Revenue", value: `N${((stats?.totalRevenue || 0) / 100).toLocaleString()}`, icon: CreditCard, trend: "+12.4%", color: "text-primary-blue-600" },
                      { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, trend: "+8.2%", color: "text-emerald-600" },
                      { label: "Active Users", value: stats?.totalUsers || 0, icon: Users, trend: "+4.1%", color: "text-orange-600" },
                      { label: "Pending Quotes", value: stats?.pendingQuotes || 0, icon: Package, trend: "0.2%", color: "text-purple-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white p-7 rounded-2xl border border-neutral-200 shadow-sm group hover:border-primary-blue-200 transition-all hover:shadow-lg hover:shadow-primary-blue-500/5">
                        <div className="flex items-center justify-between mb-5">
                           <div className={`p-2.5 rounded-xl bg-neutral-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                              <stat.icon size={22} />
                           </div>
                           <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                              <TrendingUp size={10} />
                              {stat.trend}
                           </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-primary-navy-900 tracking-tight">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Search Filtering Results Message */}
                  {searchQuery && (
                    <div className="bg-primary-blue-50/50 p-4 rounded-xl border border-primary-blue-100 flex items-center gap-3">
                       <Search size={16} className="text-primary-blue-600" />
                       <p className="text-[13px] font-bold text-primary-blue-900 leading-none">
                          Filtering platform results for "<span className="font-black italic">{searchQuery}</span>"
                       </p>
                       <button onClick={() => setSearchQuery("")} className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary-blue-600 hover:underline">Clear Search</button>
                    </div>
                  )}

                  {/* Bottom Split */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                     <div className="xl:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                           <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-primary-navy-900">Recent Logistics</h3>
                              <button onClick={() => setActiveTab("orders")} className="text-[10px] font-black text-primary-blue-600 hover:underline uppercase tracking-widest flex items-center gap-1">
                                 Detailed View <ArrowUpRight size={12} />
                              </button>
                           </div>
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <tbody>
                                    {(searchQuery ? filteredOrders : orders).slice(0, 5).map((order) => (
                                       <tr key={order.order_number} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                                          <td className="px-8 py-5">
                                             <p className="text-xs font-black text-primary-navy-900 mb-0.5">#{order.order_number}</p>
                                             <p className="text-[10px] text-neutral-400 font-bold">{format(new Date(order.created_at), "MMM d, h:mm a")}</p>
                                          </td>
                                          <td className="px-8 py-5">
                                             <p className="text-xs font-black text-primary-navy-900">{order.customer_name}</p>
                                             <p className="text-[10px] text-neutral-400 truncate max-w-[140px] italic">{order.customer_email}</p>
                                          </td>
                                          <td className="px-8 py-5">
                                             <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                                order.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                             }`}>
                                                {order.status}
                                             </span>
                                          </td>
                                          <td className="px-8 py-5 text-right text-xs font-black text-primary-navy-900">
                                             N{(order.total / 100).toLocaleString()}
                                          </td>
                                       </tr>
                                    ))}
                                    {(searchQuery ? filteredOrders : orders).length === 0 && (
                                      <tr><td colSpan={4} className="p-8 text-center text-xs font-bold text-neutral-400 italic">No matching results found.</td></tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>

                     <div className="xl:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-8">
                           <div className="flex items-center justify-between mb-8">
                              <h3 className="text-xs font-black uppercase tracking-[0.15em] text-primary-navy-900">Registered Users</h3>
                              <button onClick={() => setActiveTab("users")} className="text-neutral-400 hover:text-primary-navy-900"><MoreVertical size={16} /></button>
                           </div>
                           <div className="space-y-6">
                              {(searchQuery ? filteredUsers : users).slice(0, 5).map((u) => (
                                 <div key={u.uuid} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                       <div className="h-9 w-9 bg-neutral-100 rounded-lg flex items-center justify-center text-primary-navy-900 text-[10px] font-bold border border-neutral-200">
                                          {u.full_name.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="text-xs font-black text-primary-navy-900 leading-tight">{u.full_name}</p>
                                          <p className="text-[10px] text-neutral-400 tracking-tight lowercase">{u.role}</p>
                                       </div>
                                    </div>
                                    <ChevronRight size={14} className="text-neutral-300" />
                                 </div>
                              ))}
                           </div>
                        </div>
                        
                        <div className="bg-primary-navy-900 rounded-2xl p-7 text-white flex flex-col items-center text-center group overflow-hidden relative">
                           <div className="relative z-10">
                              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                                 <UserCircle size={22} className="text-primary-blue-400" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary-blue-400 mb-2">Internal Support</p>
                              <p className="text-sm font-bold leading-relaxed mb-6">Access the global Procurely technical documentation console.</p>
                              <button className="w-full bg-primary-blue-500 hover:bg-primary-blue-600 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg active:scale-95">Open Manual</button>
                           </div>
                           <Package size={120} className="absolute -right-8 -bottom-8 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" {...fadeIn} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                   <div className="px-8 py-8 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-neutral-50/50">
                      <div>
                         <h3 className="text-sm font-black uppercase tracking-[0.15em] text-primary-navy-900 mb-1">Global Logistics Queue</h3>
                         <p className="text-xs text-neutral-400">Total processed volume: {orders.length} items</p>
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-neutral-50/50">
                            <tr>
                               <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Order ID</th>
                               <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Client Details</th>
                               <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Timestamp</th>
                               <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Value</th>
                               <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-neutral-100">
                            {filteredOrders.map((order) => (
                              <tr key={order.order_number} className="hover:bg-neutral-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <span className="text-xs font-black text-primary-navy-900 bg-neutral-100 px-2 py-1 rounded-md">
                                       #{order.order_number}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <p className="text-xs font-black text-primary-navy-900 mb-0.5">{order.customer_name}</p>
                                    <p className="text-[10px] text-neutral-400 font-medium italic">{order.customer_email}</p>
                                 </td>
                                 <td className="px-8 py-6 text-xs text-neutral-500 font-bold">
                                    {format(new Date(order.created_at), "MMM d, yyyy")}
                                 </td>
                                 <td className="px-8 py-6 text-sm font-black text-primary-navy-900 text-right">
                                    N{(order.total / 100).toLocaleString()}
                                 </td>
                                 <td className="px-8 py-6 text-center">
                                    <select 
                                      value={order.status}
                                      onChange={(e) => handleUpdateStatus(order.order_number, e.target.value)}
                                      className={`rounded-lg px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] border-none ring-1 ring-inset shadow-sm transition-all focus:ring-2 ${
                                        order.status === 'paid' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'
                                      }`}
                                    >
                                       <option value="processing">Processing</option>
                                       <option value="paid">Paid</option>
                                       <option value="shipped">Shipped</option>
                                       <option value="cancelled">Cancelled</option>
                                    </select>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div key="users" {...fadeIn} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                   <div className="px-8 py-8 border-b border-neutral-100 bg-neutral-50/50">
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] text-primary-navy-900 mb-1">Authenticated Customer Base</h3>
                      <p className="text-xs text-neutral-400">Reviewing {users.length} active platform profiles</p>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                            <tr>
                               <th className="px-8 py-4">Client Identity</th>
                               <th className="px-8 py-4">Verification</th>
                               <th className="px-8 py-4">System Access</th>
                               <th className="px-8 py-4 text-right">Registration Date</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-neutral-100">
                            {filteredUsers.map((u) => (
                              <tr key={u.uuid} className="hover:bg-neutral-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 bg-primary-navy-900 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg">
                                          {u.full_name.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="text-xs font-black text-primary-navy-900 leading-tight">{u.full_name}</p>
                                          <p className="text-[10px] text-neutral-400 font-medium tracking-tight lowercase">{u.email}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                                       Verified Account
                                    </span>
                                 </td>
                                 <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-neutral-500 italic">
                                    {u.role} Access
                                 </td>
                                 <td className="px-8 py-6 text-right text-xs text-neutral-400 font-bold uppercase">
                                    {format(new Date(u.created_at), "MMM d, yyyy")}
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
