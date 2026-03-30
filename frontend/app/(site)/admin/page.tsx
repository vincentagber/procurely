"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  BarChart, 
  Package, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  Search,
  Bell,
  Download,
  MoreVertical,
  Activity,
  LogOut,
  Settings,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Target
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "users">("overview");
  const [fetching, setFetching] = useState(true);

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

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-slate-50">
        <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 hidden h-full w-72 bg-white border-r border-slate-200/60 lg:flex flex-col z-50">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <span className="text-xl font-black italic">P</span>
             </div>
             <span className="text-2xl font-black tracking-tight text-slate-900">flex <span className="text-indigo-600 font-medium text-sm align-super font-mono opacity-50">v2.0</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          <p className="px-5 pb-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
            Navigation
          </p>
          
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "users", label: "Customers", icon: Users },
          ].map((item: any) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center gap-3.5 rounded-2xl px-5 py-3.5 text-[15px] font-semibold transition-all duration-300 ${
                activeTab === item.id 
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50" 
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform"} />
              {item.label}
              {item.id === "orders" && orders.length > 0 && (
                <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${activeTab === item.id ? 'bg-indigo-400 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}

          <div className="pt-8 space-y-1.5">
            <p className="px-5 pb-3 text-[10px] font-bold uppercase tracking-[2px] text-slate-400">
               Integrations
            </p>
            <button className="flex w-full items-center gap-3.5 rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-slate-500 hover:bg-slate-50 transition-all">
                <Target size={20} strokeWidth={2.5} />
                Analytics
            </button>
            <button className="flex w-full items-center gap-3.5 rounded-2xl px-5 py-3.5 text-[15px] font-semibold text-slate-500 hover:bg-slate-50 transition-all">
                <Settings size={20} strokeWidth={2.5} />
                Settings
            </button>
          </div>
        </nav>

        <div className="p-6 mt-auto">
          <div className="rounded-3xl bg-indigo-600/5 p-6 border border-indigo-600/10">
             <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
                   <Users size={16} />
                </div>
                <div>
                   <p className="text-sm font-bold text-slate-900">Need Stats?</p>
                   <p className="text-[10px] text-slate-500">Go pro for more data</p>
                </div>
             </div>
             <button className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Go Pro Now
             </button>
          </div>

          <button 
            onClick={() => logout()}
            className="mt-6 flex w-full items-center gap-3 px-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            Logout Account
          </button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 lg:pl-72 transition-all duration-300">
        <div className="mx-auto max-w-[1600px] p-6 lg:p-10 space-y-10">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200/60 shadow-sm text-indigo-600">
                  {activeTab === "overview" && <LayoutDashboard size={28} />}
                  {activeTab === "orders" && <ShoppingBag size={28} />}
                  {activeTab === "users" && <Users size={28} />}
               </div>
               <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 capitalize">
                    {activeTab === "users" ? "Customers Management" : activeTab}
                  </h1>
                  <p className="text-sm font-medium text-slate-400 mt-1">Real-time overview of your platform's pulse & engagement</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="relative group hidden sm:block">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search results..."
                    className="h-14 w-72 rounded-2xl border-none bg-white px-11 text-sm font-semibold shadow-sm focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
               </div>
               
               <button className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200/60 transition-all hover:bg-slate-50 group">
                  <Bell size={22} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-600" />
               </button>

               <div className="flex items-center gap-4 pl-2">
                  <div className="px-4 py-2 border-l-2 border-slate-100 hidden sm:block">
                     <p className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Balance</p>
                     <p className="text-right text-lg font-black text-indigo-600 font-mono tracking-tight">$5.456</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white group cursor-pointer relative">
                     <div className="absolute inset-0 bg-indigo-600 flex items-center justify-center text-white font-black text-xl">
                        {user.fullName.charAt(0)}
                     </div>
                  </div>
                  <div className="hidden xl:block">
                     <p className="text-sm font-black text-slate-900 leading-none mb-1">Hi, {user.fullName.split(' ')[0]}</p>
                     <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{user.role}</p>
                  </div>
               </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-10"
              >
                {/* Actions & Filters */}
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200/40">
                      {["This Month", "Last Quarter", "Yearly"].map((f) => (
                        <button key={f} className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${f === "This Month" ? 'bg-slate-100 text-slate-900 shadow-inner' : 'text-slate-400 hover:text-slate-700'}`}>
                           {f}
                        </button>
                      ))}
                   </div>
                   <button className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                      <Download size={18} strokeWidth={2.5} />
                      Download Report
                   </button>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    { label: "Total Revenue", value: `N${((stats?.totalRevenue || 0) / 100).toLocaleString()}`, icon: BarChart, color: "indigo", change: "+ 15.6%", trend: "up" },
                    { label: "Total Visitors", value: "35k", icon: Users, color: "teal", change: "- 6.2%", trend: "down" },
                    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "purple", change: "+ 3.5%", trend: "up" },
                  ].map((stat, idx) => (
                    <motion.div 
                      key={stat.label} 
                      variants={itemVariants}
                      className="group relative overflow-hidden flex flex-col gap-6 rounded-[32px] bg-white p-8 shadow-sm border border-slate-200/60 transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                         <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] shadow-lg shadow-${stat.color}-100 bg-${stat.color}-600 text-white transition-transform group-hover:rotate-6`}>
                            <stat.icon size={26} strokeWidth={2.5} />
                         </div>
                         <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            <TrendingUp size={14} className={stat.trend === 'up' ? '' : 'rotate-180'} />
                            {stat.change}
                         </div>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[1px]">{stat.label}</p>
                        <p className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{stat.value}</p>
                      </div>
                      
                      {/* Decorative elements */}
                      <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-${stat.color}-500/5 group-hover:scale-150 transition-transform duration-700`} />
                    </motion.div>
                  ))}
                </div>

                {/* Insights Row */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 auto-rows-fr">
                  {/* Chart Sim Section */}
                  <motion.div variants={itemVariants} className="lg:col-span-8 group rounded-[40px] bg-white p-10 shadow-sm border border-slate-200/60 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Store Sessions</h3>
                          <p className="text-sm font-medium text-slate-400">Visitor activity over time</p>
                       </div>
                       <div className="flex items-center gap-10">
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Visitors</p>
                             <p className="text-2xl font-black text-slate-900">68 <span className="text-xs text-emerald-500 font-bold ml-1">↑ 15.6%</span></p>
                          </div>
                          <div className="h-10 w-[1px] bg-slate-100" />
                          <div className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100 transition-colors group">
                             <span className="text-xs font-bold text-slate-600">February</span>
                             <ChevronRight size={16} className="rotate-90 ml-2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                       </div>
                    </div>
                    
                    {/* Simulated SVG Graph */}
                    <div className="flex-1 w-full h-[250px] relative mt-4 overflow-hidden rounded-3xl">
                       <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none" className="overflow-visible">
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                               <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          {[0, 1, 2, 3, 4].map(l => (
                             <line key={l} x1="0" y1={l * 62.5} x2="800" y2={l * 62.5} stroke="#F1F5F9" strokeWidth="1" />
                          ))}
                          {/* Path */}
                          <motion.path 
                            d="M 0 200 Q 150 180, 250 190 T 450 140 T 650 90 T 800 50" 
                            fill="none" 
                            stroke="#6366f1" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                          <path d="M 0 200 Q 150 180, 250 190 T 450 140 T 650 90 T 800 50 L 800 250 L 0 250 Z" fill="url(#chartGradient)" />
                          
                          {/* Tooltip dot */}
                          <motion.circle 
                            cx="275" cy="188" r="8" fill="white" stroke="#6366f1" strokeWidth="3"
                            initial={{ scale: 0 }} 
                            animate={{ scale: [0, 1.2, 1] }} 
                            transition={{ delay: 1 }}
                            className="shadow-xl"
                          />
                       </svg>
                       <div className="absolute top-[125px] left-[295px] px-3 py-2 bg-slate-900 rounded-xl shadow-2xl z-10">
                          <p className="text-[10px] font-bold text-slate-400">Feb 21</p>
                          <p className="text-xs font-black text-white">$1,540.20</p>
                       </div>

                       <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 pb-2">
                          {[21, 22, 23, 24, 25, 26, 27].map(d => (
                            <div key={d} className={`h-12 w-12 flex items-center justify-center rounded-2xl text-sm font-black transition-colors cursor-pointer ${d === 21 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-900'}`}>{d}</div>
                          ))}
                       </div>
                    </div>
                  </motion.div>

                  {/* Circular Stat Sim */}
                  <motion.div variants={itemVariants} className="lg:col-span-4 rounded-[40px] bg-white p-10 shadow-sm border border-slate-200/60 overflow-hidden relative flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8 self-start">Conversion</h3>
                    <div className="relative h-64 w-64 flex items-center justify-center">
                       <svg viewBox="0 0 100 100" className="h-full w-full rotate-[135deg]">
                          <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="8" fill="none" strokeDasharray="188 251" strokeLinecap="round" />
                          <motion.circle 
                            cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="8" fill="none" 
                            strokeDasharray="145 251" strokeLinecap="round" 
                            initial={{ strokeDashoffset: 145 }}
                            animate={{ strokeDashoffset: 0 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-4xl font-black text-slate-900 tracking-tighter">58.19%</p>
                          <p className="text-xs font-bold text-emerald-500 mt-1 flex items-center gap-1">
                             <TrendingUp size={14} /> ↑ 3.5%
                          </p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 w-full gap-4 mt-8 pt-8 border-t border-slate-100">
                       <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Income</p>
                          <p className="text-sm font-black text-slate-900">$542,317</p>
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expenses</p>
                          <p className="text-sm font-black text-slate-900">$497,456</p>
                       </div>
                    </div>
                  </motion.div>
                </div>

                {/* Lists Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Recent Orders List */}
                  <motion.div variants={itemVariants} className="rounded-[40px] bg-white p-10 shadow-sm border border-slate-200/60">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity</h3>
                        <p className="text-sm font-medium text-slate-400">Latest orders from the warehouse</p>
                      </div>
                      <button onClick={() => setActiveTab("orders")} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <ArrowUpRight size={22} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order, idx) => (
                        <motion.div 
                          key={order.order_number} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-center justify-between rounded-3xl border border-slate-50 bg-[#F9FBFF]/50 p-5 group hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer"
                        >
                           <div className="flex items-center gap-4">
                              <div className={`h-11 w-11 flex items-center justify-center rounded-2xl text-white shadow-lg ${order.status === 'paid' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-orange-500 shadow-orange-100'}`}>
                                 <CreditCard size={18} strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-[15px] font-black text-slate-900 leading-tight">Order #{order.order_number}</p>
                                <p className="text-xs font-semibold text-slate-400">{order.customer_name}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[15px] font-black text-indigo-600">N{(order.total / 100).toLocaleString()}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(order.created_at), "h:mm a")}</p>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* New Customers List */}
                  <motion.div variants={itemVariants} className="rounded-[40px] bg-white p-10 shadow-sm border border-slate-200/60">
                     <div className="flex items-center justify-between mb-10">
                       <div>
                         <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Customers</h3>
                         <p className="text-sm font-medium text-slate-400">Most engaged buyers this week</p>
                       </div>
                       <button onClick={() => setActiveTab("users")} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <Activity size={22} />
                      </button>
                    </div>

                    <div className="space-y-3">
                       {users.slice(0, 5).map((u, idx) => (
                          <motion.div 
                            key={u.uuid} 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-center justify-between rounded-3xl border border-slate-50 bg-[#F9FBFF]/50 p-5 group hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer"
                          >
                             <div className="flex items-center gap-4">
                                <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-black ring-4 ring-slate-50">
                                   {u.full_name.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-[15px] font-black text-slate-900 leading-tight">{u.full_name}</p>
                                   <p className="text-xs font-semibold text-slate-400">{u.email}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider">
                                   Verified
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {(activeTab === "orders" || activeTab === "users") && (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-[40px] bg-white shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                   <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Full List Activity</h3>
                      <p className="text-sm font-medium text-slate-400">Currently viewing {activeTab} logs</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 transition-colors shadow-sm text-slate-400"><Search size={18} /></button>
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 transition-colors shadow-sm text-slate-400"><Download size={18} /></button>
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 transition-colors shadow-sm text-slate-400"><MoreVertical size={18} /></button>
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                  {activeTab === "orders" ? (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Number</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Customer</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Created At</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Total Amount</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Update Status</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.map((order) => (
                          <tr key={order.order_number} className="group transition hover:bg-indigo-50/30">
                            <td className="px-8 py-6">
                              <span className="flex h-10 w-24 items-center justify-center rounded-2xl bg-slate-900 text-[13px] font-black text-white shadow-lg">#{order.order_number}</span>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-[15px] font-black text-slate-900 leading-tight">{order.customer_name}</p>
                               <p className="text-xs font-semibold text-slate-400">{order.customer_email}</p>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold text-slate-500 italic">{format(new Date(order.created_at), "MMM d, yyyy")}</td>
                            <td className="px-8 py-6">
                               <p className="text-[17px] font-black text-indigo-600 font-mono tracking-tight">N{(order.total / 100).toLocaleString()}</p>
                            </td>
                            <td className="px-8 py-6">
                               <div className="relative group/select">
                               <select 
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.order_number, e.target.value)}
                                className={`appearance-none rounded-[18px] pl-5 pr-10 py-2.5 text-xs font-black border-2 transition-all cursor-pointer ring-offset-2 focus:ring-4 focus:ring-indigo-100 ${
                                  order.status === 'paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
                                  order.status === 'processing' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                                  'bg-slate-50 border-slate-200 text-slate-600'
                                }`}
                               >
                                  <option value="processing">Processing</option>
                                  <option value="paid">Paid</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="cancelled">Cancelled</option>
                               </select>
                               <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none opacity-50" />
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:rotate-90 transition-all shadow-sm">
                                 <MoreVertical size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Customer Identity</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Verified Email</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Permission Level</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">Member Since</th>
                          <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[2px] text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.uuid} className="group transition hover:bg-indigo-50/30">
                            <td className="px-8 py-6 flex items-center gap-4">
                               <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white font-black text-sm ring-4 ring-slate-100">
                                  {u.full_name.charAt(0)}
                               </div>
                               <p className="text-[15px] font-black text-slate-900 uppercase tracking-tight">{u.full_name}</p>
                            </td>
                            <td className="px-8 py-6 text-[15px] font-semibold text-slate-500 italic">{u.email}</td>
                            <td className="px-8 py-6">
                               <span className={`inline-flex items-center gap-1.5 rounded-[12px] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                                  u.role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {u.role === 'admin' && <CheckCircle size={12} />}
                                  {u.role}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-[13px] font-bold text-slate-400">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                            <td className="px-8 py-6 text-right">
                               <button className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm">
                                  <Settings size={20} />
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
  );
}
