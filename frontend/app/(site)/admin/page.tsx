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
  ShieldCheck,
  CreditCard,
  LogOut,
  AppWindow,
  Activity,
  MoreHorizontal
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
      <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-6">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary-blue-500 border-t-transparent shadow-sm" />
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Authenticating Admin Session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111827] font-body antialiased">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* --- GLOBAL SAAS SIDEBAR --- */}
        <aside className="w-full lg:w-[260px] bg-white border-r border-[#F3F4F6] flex flex-col z-50">
          <div className="p-8 pb-4">
             <div className="flex items-center gap-2.5 mb-12">
                <div className="h-7 w-7 bg-primary-blue-600 rounded flex items-center justify-center text-white shadow-sm ring-4 ring-primary-blue-50">
                   <ShieldCheck size={16} />
                </div>
                <span className="text-base font-black tracking-tight text-[#111827] font-display uppercase tracking-widest">Procurely <span className="text-[#9CA3AF] font-bold">Admin</span></span>
             </div>

             <nav className="space-y-0.5">
                {[
                  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                  { id: "orders", label: "All Orders", icon: ShoppingBag },
                  { id: "users", label: "Client Base", icon: Users },
                ].map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-bold transition-all ${
                      activeTab === item.id 
                      ? "bg-neutral-100 text-[#111827]" 
                      : "text-neutral-500 hover:text-[#111827]"
                    }`}
                  >
                    <item.icon size={16} className={activeTab === item.id ? "text-primary-blue-600" : "text-neutral-400"} />
                    {item.label}
                  </button>
                ))}
             </nav>
          </div>

          <div className="mt-auto p-6 space-y-4">
             <button 
               onClick={logout}
               className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50/50 transition-all"
             >
                <LogOut size={16} />
                Logout Session
             </button>

             <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary-blue-600 flex items-center justify-center text-white text-[10px] font-black uppercase">
                   {user.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-bold text-[#111827] truncate leading-none mb-1">{user.fullName}</p>
                   <p className="text-[9px] text-[#9CA3AF] font-black uppercase tracking-wider">{user.role}</p>
                </div>
             </div>
          </div>
        </aside>

        {/* --- PROFESSIONAL MAIN CONTENT AREA --- */}
        <main className="flex-1 flex flex-col bg-[#FAFAFA]">
          {/* HEADER */}
          <header className="h-[64px] bg-white border-b border-[#F3F4F6] flex items-center justify-between px-8 lg:px-12 sticky top-0 z-40">
             <div className="flex-1 flex items-center gap-12">
                <div className="flex items-center gap-3 w-48">
                   <Activity size={18} className="text-primary-blue-600" />
                   <h2 className="text-sm font-black text-[#111827] uppercase tracking-widest font-display translate-y-[1px]">
                      {activeTab}
                   </h2>
                </div>
                {/* CENTERED LONG SEARCH BAR */}
                <div className="relative group w-full max-w-4xl mx-auto">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-primary-blue-600 transition-colors" />
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={`Advanced Search in ${activeTab.toUpperCase()} LEDGER...`}
                     className="h-[40px] w-full rounded bg-neutral-50 border border-neutral-100 px-12 text-[13px] font-bold focus:ring-[3px] focus:ring-primary-blue-50 focus:bg-white focus:border-primary-blue-200 transition-all placeholder:text-[#D1D5DB] placeholder:italic"
                   />
                </div>
             </div>

             <div className="flex items-center gap-6 ml-12">
                <button className="relative text-neutral-400 hover:text-primary-blue-600 transition-colors p-2 hover:bg-neutral-50 rounded-lg">
                   <Bell size={20} />
                </button>
             </div>
          </header>

          <div className="p-8 lg:p-12 space-y-10">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{opacity:0, y: 5}} animate={{opacity:1, y: 0}} className="space-y-12">
                  
                  {/* Metric Display */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Gross Revenue", value: `N${((stats?.totalRevenue || 0) / 100).toLocaleString()}`, icon: CreditCard },
                      { label: "Purchase Volume", value: stats?.totalOrders || 0, icon: ShoppingBag },
                      { label: "Active Identities", value: stats?.totalUsers || 0, icon: Users },
                      { label: "Open Logistics", value: stats?.pendingQuotes || 0, icon: Package },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white p-6 rounded border border-[#F3F4F6] hover:shadow-sm transition-all group">
                         <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">{stat.label}</p>
                            <stat.icon size={16} className="text-[#E5E7EB] group-hover:text-primary-blue-600 transition-colors" />
                         </div>
                         <div className="flex items-end justify-between">
                            <p className="text-2xl font-black text-[#111827] tracking-tight">{stat.value}</p>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Live Audit</span>
                         </div>
                      </div>
                    ))}
                  </div>

                  {/* Operational View */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                     <div className="xl:col-span-8 bg-white rounded border border-[#F3F4F6] shadow-sm">
                        <div className="px-8 py-4 border-b border-[#FAFAFA] flex items-center justify-between">
                           <h3 className="text-[10px] font-black uppercase tracking-widest text-[#111827]">Logistics Pipeline</h3>
                           <button onClick={() => setActiveTab("orders")} className="text-[10px] font-black text-primary-blue-600 hover:underline flex items-center gap-1.5 uppercase tracking-widest">
                              Console View <ArrowUpRight size={12} />
                           </button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <tbody className="divide-y divide-neutral-50/50">
                                 {(searchQuery ? filteredOrders : orders).slice(0, 6).map((order) => (
                                    <tr key={order.order_number} className="hover:bg-neutral-50/50 transition-colors group">
                                       <td className="px-8 py-4">
                                          <p className="text-xs font-black text-[#111827] group-hover:text-primary-blue-600 transition-colors">#{order.order_number}</p>
                                          <p className="text-[10px] font-bold text-[#D1D5DB] tracking-tighter">REF-{order.order_number.slice(-4).toUpperCase()}</p>
                                       </td>
                                       <td className="px-8 py-4">
                                          <p className="text-xs font-bold text-[#111827]">{order.customer_name}</p>
                                       </td>
                                       <td className="px-8 py-4">
                                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                             order.status === 'paid' ? 'text-emerald-600 border border-emerald-100' : 'text-amber-600 border border-amber-100'
                                          }`}>
                                             {order.status}
                                          </span>
                                       </td>
                                       <td className="px-8 py-4 text-right text-xs font-black text-[#111827]">
                                          N{(order.total / 100).toLocaleString()}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     <div className="xl:col-span-4 bg-white rounded border border-[#F3F4F6] shadow-sm p-8">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#111827] mb-8">Registered Entities</h3>
                        <div className="space-y-6">
                           {(searchQuery ? filteredUsers : users).slice(0, 5).map((u) => (
                              <div key={u.uuid} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-[#FAFAFA] rounded flex items-center justify-center text-[#111827] text-[10px] font-black border border-neutral-100">
                                       {u.full_name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-[#111827] leading-tight">{u.full_name}</p>
                                       <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-tight">{format(new Date(u.created_at), "MMM d")}</p>
                                    </div>
                                 </div>
                                 <button className="text-[#E5E7EB] hover:text-primary-blue-600 transition-colors">
                                    <MoreHorizontal size={14} />
                                 </button>
                              </div>
                           ))}
                        </div>
                        <button onClick={() => setActiveTab("users")} className="w-full mt-10 p-3 rounded bg-[#FAFAFA] border border-[#F3F4F6] text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] hover:text-[#111827] transition-all">
                           Global Directory
                        </button>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded border border-[#F3F4F6] shadow-sm overflow-hidden">
                   <div className="px-8 py-8 border-b border-[#FAFAFA] flex items-center justify-between">
                      <div>
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-[#111827]">Logistics Verification Hub</h3>
                         <p className="text-xs text-[#9CA3AF] mt-1">Audit Trail: {orders.length} Verified Submissions</p>
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-[#FAFAFA] text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
                            <tr>
                               <th className="px-8 py-4">Reference</th>
                               <th className="px-8 py-4">Customer</th>
                               <th className="px-8 py-4">Timestamp</th>
                               <th className="px-8 py-4 text-right">Settlement</th>
                               <th className="px-8 py-4 text-center">Status Protocol</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-neutral-50/50">
                            {filteredOrders.map((order) => (
                              <tr key={order.order_number} className="hover:bg-neutral-50 transition-colors">
                                 <td className="px-8 py-6">
                                    <span className="text-xs font-black text-primary-blue-600 uppercase tracking-tighter">
                                       #{order.order_number}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <p className="text-xs font-black text-[#111827]">{order.customer_name}</p>
                                    <p className="text-[10px] font-medium text-[#9CA3AF] italic lowercase leading-none mt-0.5">{order.customer_email}</p>
                                 </td>
                                 <td className="px-8 py-6 text-xs text-[#9CA3AF] font-bold">
                                    {format(new Date(order.created_at), "MMM d, yyyy")}
                                 </td>
                                 <td className="px-8 py-6 text-sm font-black text-[#111827] text-right uppercase tracking-tighter">
                                    N{(order.total / 100).toLocaleString()}
                                 </td>
                                 <td className="px-8 py-6 text-center">
                                    <select 
                                      value={order.status}
                                      onChange={(e) => handleUpdateStatus(order.order_number, e.target.value)}
                                      className="appearance-none bg-neutral-50 border border-neutral-100 px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest text-[#111827] focus:ring-2 focus:ring-primary-blue-600/10 cursor-pointer text-center outline-none"
                                    >
                                       <option value="processing">Processing</option>
                                       <option value="paid">Settled</option>
                                       <option value="shipped">Dispatched</option>
                                       <option value="cancelled">Terminated</option>
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
                <motion.div key="users" initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded border border-[#F3F4F6] shadow-sm overflow-hidden">
                   <div className="px-8 py-8 border-b border-[#FAFAFA]">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-[#111827]">Identity Registry Console</h3>
                      <p className="text-xs text-[#9CA3AF] mt-1">Managing {users.length} Unique Profiles</p>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-[#FAFAFA] text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
                            <tr>
                               <th className="px-8 py-4">Legal Name</th>
                               <th className="px-8 py-4">Verification</th>
                               <th className="px-8 py-4 text-right">Access Protocol</th>
                               <th className="px-8 py-4 text-right">Identity Created</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#FAFAFA]">
                            {filteredUsers.map((u) => (
                              <tr key={u.uuid} className="hover:bg-neutral-50 transition-colors">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="h-9 w-9 bg-[#111827] rounded flex items-center justify-center text-white text-[10px] font-black">
                                          {u.full_name.charAt(0)}
                                       </div>
                                       <p className="text-xs font-black text-[#111827] uppercase tracking-tight">{u.full_name}</p>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-xs text-[#9CA3AF] font-medium lowercase leading-none italic">{u.email}</td>
                                 <td className="px-8 py-6 text-right">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-blue-600 border border-primary-blue-100 px-2 py-0.5 rounded">
                                       {u.role}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6 text-right text-xs text-[#9CA3AF] font-bold uppercase tracking-widest">
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
