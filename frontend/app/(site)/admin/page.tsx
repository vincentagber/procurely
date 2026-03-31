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
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
  X,
  ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "users" | "products">("overview");
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", shortDescription: "", category: "", price: "",
    image: "", badge: "", featured: false, homepageSlot: "", stockLevel: "100"
  });
  const [productSaving, setProductSaving] = useState(false);

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
      const [s, o, u, p] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(10),
        api.getAdminUsers(10),
        api.getAdminProducts(),
      ]);
      setStats(s);
      setOrders(o);
      setUsers(u);
      setProducts(p);
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

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", shortDescription: "", category: "", price: "", image: "", badge: "", featured: false, homepageSlot: "", stockLevel: "100" });
    setShowProductModal(true);
  };

  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name ?? "",
      shortDescription: p.shortDescription ?? "",
      category: p.category ?? "",
      price: String(p.price ?? ""),
      image: p.image ?? "",
      badge: p.badge ?? "",
      featured: !!p.featured,
      homepageSlot: p.homepageSlot ?? "",
      stockLevel: "100",
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    setProductSaving(true);
    try {
      const payload = { ...productForm, price: parseInt(productForm.price, 10) || 0 };
      if (editingProduct) {
        await api.updateAdminProduct(editingProduct.id, payload);
      } else {
        await api.createAdminProduct(payload);
      }
      setShowProductModal(false);
      fetchData();
    } catch (e: any) {
      alert(e.message ?? "Failed to save product.");
    } finally {
      setProductSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteAdminProduct(id);
      fetchData();
    } catch (e: any) {
      alert(e.message ?? "Failed to delete product.");
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
    <div className="min-h-screen bg-[#F6F7FD] text-[#13184f] font-sans antialiased selection:bg-primary-blue-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* --- PREMIUM ENTERPRISE SIDEBAR --- */}
        <aside className="w-full lg:w-[280px] bg-[#0b103e] text-white flex flex-col z-50 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
          <div className="p-8 pb-10">
             <div className="flex items-center gap-3 mb-12">
                <div className="h-9 w-9 bg-[#1900ff] rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(25,0,255,0.4)] transition-transform hover:rotate-3">
                   <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter leading-none">PROCURELY</span>
                  <span className="text-[10px] font-black text-[#1900ff] uppercase tracking-[0.2em] mt-1 opacity-90">Admin Console</span>
                </div>
             </div>
             
             <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] mb-4 ml-3">Main Menu</p>
                {[
                  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                  { id: "orders", label: "Operations Hub", icon: Activity },
                  { id: "users", label: "Client Directory", icon: Users },
                  { id: "products", label: "Product Catalog", icon: Package },
                ].map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-4 text-[13px] font-black transition-all duration-300 ${
                      activeTab === item.id 
                      ? "bg-[#1900ff] text-white shadow-[0_10px_20px_rgba(25,0,255,0.25)]" 
                      : "text-white/40 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={19} className={`transition-colors ${activeTab === item.id ? "text-white" : "text-white/20 group-hover:text-white/40"}`} />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>

          <div className="mt-auto p-6 space-y-6">
             <div className="px-4 py-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 size-24 bg-[#1900ff] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <p className="relative text-xs font-medium text-white/60 mb-1">Quick Actions</p>
                <h4 className="relative text-sm font-black text-white uppercase tracking-tight">Post New Notice</h4>
                <button className="relative mt-4 w-full py-2 bg-[#1900ff] hover:bg-[#1900ff]/90 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-[0.98]">Launch</button>
             </div>

             <div className="flex flex-col gap-4">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2 text-[12px] font-bold text-red-400 hover:text-red-300 transition-colors w-fit"
                >
                    <LogOut size={16} />
                    Terminate Session
                </button>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3 group cursor-pointer hover:bg-white/10 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#1900ff] to-[#4230ff] flex items-center justify-center text-white text-sm font-black shadow-lg">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-black text-white truncate mb-0.5">{user.fullName}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider">Super Admin</span>
                      </div>
                    </div>
                </div>
             </div>
          </div>
        </aside>

        {/* --- MAIN DASHBOARD INTERFACE --- */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* TOP BAR */}
          <header className="h-[80px] bg-white flex items-center justify-between px-8 lg:px-12 z-40 border-b border-[#F0F2F5]">
             <div className="flex items-center gap-8 w-full">
                <div className="hidden xl:flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-primary-blue-50 text-[#1900ff]">
                    <AppWindow size={20} />
                   </div>
                   <h2 className="text-xl font-black text-[#13184f] tracking-tight uppercase">
                      Overview
                   </h2>
                </div>

                <div className="relative group flex-1 max-w-3xl">
                   <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1900ff] transition-colors" />
                   <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder={`Command search in ${activeTab}...`}
                     className="h-[52px] w-full rounded-2xl bg-[#F8F9FB] border-none px-14 text-sm font-bold text-[#13184f] focus:ring-4 focus:ring-primary-blue-50/50 focus:bg-white transition-all placeholder:text-slate-300 outline-none"
                   />
                   <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Cmd</span>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">K</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-5 ml-8">
                <button className="relative p-2.5 bg-[#F8F9FB] rounded-xl text-slate-400 hover:text-[#1900ff] transition-all hover:bg-white hover:shadow-sm">
                   <Bell size={20} />
                   <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white" />
                </button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F6F7FD] p-8 lg:p-12">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="space-y-10">
                  
                  {/* HEADING SECTION */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-[#13184f]">Welcome back, {user.fullName.split(' ')[0]} 👋</h1>
                    <p className="text-sm font-medium text-slate-500">Here's what's happening across Procurely today.</p>
                  </div>

                  {/* KPi GRID */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Total Revenue", value: `N${((stats?.totalRevenue || 0) / 100).toLocaleString()}`, icon: CreditCard, trend: "+12.4%", color: "blue" },
                      { label: "Order Volume", value: stats?.totalOrders || 0, icon: ShoppingBag, trend: "+8.2%", color: "indigo" },
                      { label: "Active Clients", value: stats?.totalUsers || 0, icon: Users, trend: "+3.1%", color: "amber" },
                      { label: "Open Quotes", value: stats?.pendingQuotes || 0, icon: Package, trend: "-2.4%", color: "rose" },
                    ].map((stat, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label} 
                        className="relative bg-white p-8 rounded-[32px] border border-white shadow-[0_20px_50px_rgba(19,24,79,0.04)] group transition-all hover:shadow-[0_30px_60px_rgba(19,24,79,0.08)]"
                      >
                         <div className="flex items-center justify-between mb-8">
                            <div className={`size-14 rounded-2xl bg-[#0b103e] flex items-center justify-center text-white shadow-xl shadow-blue-500/5`}>
                              <stat.icon size={26} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[11px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'} px-3 py-1 rounded-full uppercase tracking-tighter`}>
                              {stat.trend}
                            </span>
                         </div>
                         
                         <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">{stat.label}</p>
                         <h3 className="text-3xl font-black text-[#0b103e] tracking-tight">{stat.value}</h3>
                      </motion.div>
                    ))}
                  </div>

                  {/* OPERATION HUB */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                     <div className="xl:col-span-8 bg-white rounded-[32px] border border-white shadow-[0_10px_40px_rgba(19,24,79,0.03)] overflow-hidden">
                        <div className="px-10 py-8 border-b border-[#F8F9FB] flex items-center justify-between bg-white sticky top-0 z-10">
                           <div className="flex items-center gap-4">
                              <div className="size-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <TrendingUp size={20} />
                              </div>
                              <div>
                                <h3 className="text-lg font-black text-[#13184f] tracking-tight uppercase">Real-time Operations</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Active Procurement Stream</p>
                              </div>
                           </div>
                           <button onClick={() => setActiveTab("orders")} className="h-10 px-6 rounded-xl bg-[#F8F9FB] text-[11px] font-black text-[#1900ff] hover:bg-[#1900ff] hover:text-white transition-all uppercase tracking-widest flex items-center gap-2">
                              Full Monitor <ArrowUpRight size={14} />
                           </button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                <tr className="bg-[#0b103e] text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                                  <th className="px-10 py-6">Operational Ident</th>
                                  <th className="px-10 py-6">Assigned Entity</th>
                                  <th className="px-10 py-6">Protocol Status</th>
                                  <th className="px-10 py-6 text-right">Settlement</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {(searchQuery ? filteredOrders : orders).slice(0, 8).map((order) => (
                                    <tr key={order.order_number} className="hover:bg-slate-50 transition-all group pointer-events-none">
                                       <td className="px-10 py-8">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-[#0b103e] group-hover:text-[#1900ff] transition-colors leading-none mb-1.5 uppercase tracking-tighter">PR-#{order.order_number}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secure Ledger</span>
                                          </div>
                                       </td>
                                       <td className="px-10 py-8">
                                          <p className="text-sm font-black text-[#0b103e]">{order.customer_name}</p>
                                          <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-tight">Verified Client</p>
                                       </td>
                                       <td className="px-10 py-8 text-center sm:text-left">
                                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                                             order.status === 'paid' 
                                             ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                             : 'bg-indigo-50 text-[#1900ff] border border-indigo-100'
                                          }`}>
                                             <span className={`size-1.5 rounded-full ${order.status === 'paid' ? 'bg-emerald-500' : 'bg-[#1900ff] animate-pulse'}`} />
                                             {order.status}
                                          </span>
                                       </td>
                                       <td className="px-10 py-8 text-right">
                                          <span className="text-lg font-black text-[#0b103e] tracking-tight">N{(order.total / 100).toLocaleString()}</span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     <div className="xl:col-span-4 space-y-10">
                        {/* REGISTERED ENTITIES */}
                        <div className="bg-[#13184f] rounded-[32px] p-8 text-white relative overflow-hidden">
                           <div className="absolute right-0 bottom-0 size-48 bg-[#1900ff] blur-[100px] opacity-40 translate-x-24 translate-y-24" />
                           
                           <div className="relative z-10">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-8">Client Acquisition</h3>
                              <div className="space-y-6">
                                 {(searchQuery ? filteredUsers : users).slice(0, 5).map((u) => (
                                    <div key={u.uuid} className="flex items-center justify-between group cursor-pointer">
                                       <div className="flex items-center gap-4">
                                          <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-white text-xs font-black border border-white/5 group-hover:bg-[#1900ff] group-hover:border-[#1900ff] transition-all">
                                             {u.full_name.charAt(0)}
                                          </div>
                                          <div>
                                             <p className="text-sm font-black text-white group-hover:translate-x-1 transition-transform tracking-tight">{u.full_name}</p>
                                             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{format(new Date(u.created_at), "MMM d, yyyy")}</p>
                                          </div>
                                       </div>
                                       <div className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <ChevronRight size={14} className="text-white" />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                              <button onClick={() => setActiveTab("users")} className="w-full mt-10 h-14 rounded-2xl bg-[#1900ff] text-[11px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-[#13184f] transition-all shadow-xl shadow-blue-500/20">
                                 Global Identity Hub
                              </button>
                           </div>
                        </div>

                         {/* SYSTEM STATUS BOARD */}
                         <div className="bg-white rounded-[32px] p-8 border border-white shadow-[0_10px_40px_rgba(19,24,79,0.03)]">
                            <div className="flex items-center gap-3 mb-6 font-black uppercase tracking-widest text-[10px] text-slate-400">
                              <Activity size={14} className="text-[#1900ff]" />
                              Infrastructure Health
                            </div>
                            <div className="space-y-4">
                               <div className="flex flex-col gap-3">
                                  <div className="flex justify-between text-[11px] font-black">
                                     <span className="uppercase tracking-widest text-slate-400">Database Synchronization</span>
                                     <span className="text-[#1900ff]">Optimized</span>
                                  </div>
                                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-gradient-to-r from-blue-500 to-[#1900ff] w-full rounded-full shadow-[0_0_10px_rgba(25,0,255,0.4)]" />
                                  </div>
                               </div>
                               <div className="flex flex-col gap-3">
                                  <div className="flex justify-between text-[11px] font-black">
                                     <span className="uppercase tracking-widest text-slate-400">Encrypted Transactions</span>
                                     <span className="text-emerald-500">Verified</span>
                                  </div>
                                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-emerald-500 w-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                                  </div>
                               </div>
                            </div>
                         </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div key="orders" initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} className="bg-white rounded-[40px] border border-white shadow-[0_20px_60px_rgba(19,24,79,0.04)] overflow-hidden">
                   <div className="px-12 py-10 border-b border-[#F8F9FB] flex items-center justify-between">
                      <div>
                         <h3 className="text-2xl font-black text-[#13184f] tracking-tight uppercase">Operational Ledger</h3>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Found {orders.length} unique procurement protocols</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button className="h-11 px-6 rounded-2xl bg-[#F8F9FB] text-[11px] font-black text-slate-500 uppercase tracking-tighter hover:bg-slate-100 transition-all">Export CSV</button>
                         <button className="h-11 px-6 rounded-2xl bg-[#1900ff] text-[11px] font-black text-white uppercase tracking-tighter hover:bg-[#0b103e] transition-all shadow-lg shadow-blue-600/20">Audit Full History</button>
                      </div>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-[#F8F9FB]/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                               <th className="px-12 py-5">Operational ID</th>
                               <th className="px-12 py-5">Legal Entity</th>
                               <th className="px-12 py-5">Dispatch Date</th>
                               <th className="px-12 py-5 text-right">Settlement</th>
                               <th className="px-12 py-5 text-center">Status Protocol</th>
                               <th className="px-12 py-5"></th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#F8F9FB]">
                            {filteredOrders.map((order) => (
                              <tr key={order.order_number} className="hover:bg-primary-blue-50/20 transition-all group">
                                 <td className="px-12 py-8">
                                    <span className="text-xs font-black text-[#1900ff] bg-primary-blue-50 px-2 py-1 rounded-lg uppercase tracking-tight">
                                       #ORD-{order.order_number}
                                    </span>
                                 </td>
                                 <td className="px-12 py-8">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-[#13184f]">{order.customer_name}</span>
                                       <span className="text-[10px] font-bold text-slate-400 lowercase tracking-tight mt-0.5">{order.customer_email}</span>
                                    </div>
                                 </td>
                                 <td className="px-12 py-8 text-xs text-slate-500 font-bold">
                                    {format(new Date(order.created_at), "MMM d, yyyy")}
                                 </td>
                                 <td className="px-12 py-8 text-lg font-black text-[#13184f] text-right tracking-tighter">
                                    N{(order.total / 100).toLocaleString()}
                                 </td>
                                 <td className="px-12 py-8 text-center">
                                    <div className="relative inline-block w-40">
                                       <select 
                                         value={order.status}
                                         onChange={(e) => handleUpdateStatus(order.order_number, e.target.value)}
                                         className="w-full appearance-none bg-[#F8F9FB] border border-[#F0F2F5] px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#13184f] focus:ring-4 focus:ring-primary-blue-50 cursor-pointer text-center outline-none hover:bg-white transition-all"
                                       >
                                          <option value="processing">Processing</option>
                                          <option value="paid">Settled</option>
                                          <option value="shipped">Dispatched</option>
                                          <option value="cancelled">Terminated</option>
                                       </select>
                                       <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                          <span className={`size-2 rounded-full ${order.status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-12 py-8 text-center">
                                    <button className="p-2.5 text-slate-300 hover:text-[#1900ff] hover:bg-primary-blue-50 rounded-xl transition-all">
                                       <MoreHorizontal size={20} />
                                    </button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div key="users" initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} className="bg-white rounded-[40px] border border-white shadow-[0_20px_60px_rgba(19,24,79,0.04)] overflow-hidden">
                   <div className="px-12 py-10 border-b border-[#F8F9FB]">
                      <h3 className="text-2xl font-black text-[#13184f] tracking-tight uppercase">Registry Command</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Identified {users.length} verified procurement agents</p>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-[#F8F9FB]/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                               <th className="px-12 py-5">Agent Profile</th>
                               <th className="px-12 py-5">Communication Endpoint</th>
                               <th className="px-12 py-5 text-right">Clearance Level</th>
                               <th className="px-12 py-5 text-right">Registration Epoch</th>
                               <th className="px-12 py-5"></th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#F8F9FB]">
                            {filteredUsers.map((u) => (
                              <tr key={u.uuid} className="hover:bg-primary-blue-50/20 transition-all group">
                                 <td className="px-12 py-8">
                                    <div className="flex items-center gap-5">
                                       <div className="h-12 w-12 bg-[#13184f] rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-[#13184f]/20 group-hover:bg-[#1900ff] transition-all">
                                          <p className="text-base font-black text-[#13184f] tracking-tight uppercase">{u.full_name}</p>
                                          <div className="flex items-center gap-1.5">
                                             <span className="size-1.5 rounded-full bg-emerald-500" />
                                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Partner</span>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-12 py-8 text-sm text-[#13184f] font-medium transition-colors group-hover:text-[#1900ff]">{u.email}</td>
                                 <td className="px-12 py-8 text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${
                                       u.role === 'admin' ? 'text-[#1900ff] border-[#1900ff]/20 bg-primary-blue-50' : 'text-slate-500 border-slate-100 bg-slate-50'
                                    }`}>
                                       {u.role}
                                    </span>
                                 </td>
                                 <td className="px-12 py-8 text-right text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    {format(new Date(u.created_at), "MMMM d, yyyy")}
                                 </td>
                                 <td className="px-12 py-8 text-right">
                                    <button className="h-10 px-6 rounded-xl bg-[#F8F9FB] text-[10px] font-black text-[#13184f] uppercase tracking-widest hover:bg-[#13184f] hover:text-white transition-all shadow-sm">Manage</button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {/* ─── PRODUCTS TAB ─── */}
              {activeTab === "products" && (
                <motion.div key="products" initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#0b103e] tracking-tight uppercase">Product Catalog</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{products.length} items available on Buy Materials</p>
                    </div>
                    <button
                      onClick={openAddProduct}
                      className="flex items-center gap-2 h-12 px-7 rounded-2xl bg-[#1900ff] text-[12px] font-black text-white uppercase tracking-[0.15em] hover:bg-[#0b103e] transition-all shadow-lg shadow-blue-500/20"
                    >
                      <Plus size={16} /> Add Product
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.filter(p =>
                      searchQuery === "" ||
                      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        className="bg-white rounded-[28px] border border-white shadow-[0_10px_40px_rgba(19,24,79,0.04)] overflow-hidden group hover:shadow-[0_20px_50px_rgba(19,24,79,0.08)] transition-all"
                      >
                        <div className="relative h-44 bg-[#F6F7FD] flex items-center justify-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <ImageIcon size={40} className="text-slate-200" />
                          )}
                          {product.badge && (
                            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-[#1900ff] text-white text-[9px] font-black uppercase tracking-widest">{product.badge}</span>
                          )}
                          {product.featured && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest">Featured</span>
                          )}
                        </div>
                        <div className="p-6">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{product.category}</p>
                          <h4 className="text-sm font-black text-[#0b103e] uppercase tracking-tight mb-1">{product.name}</h4>
                          <p className="text-[11px] text-slate-400 font-medium mb-4 line-clamp-2">{product.shortDescription}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-[#0b103e] tracking-tight">N{Number(product.price).toLocaleString()}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditProduct(product)}
                                className="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#1900ff] hover:text-white transition-all"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ─── PRODUCT MODAL ─── */}
      <AnimatePresence>
        {showProductModal && (
          <motion.div
            initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowProductModal(false)}
          >
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: 20}} animate={{opacity: 1, scale: 1, y: 0}} exit={{opacity: 0, scale: 0.95}}
              className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              <div className="bg-[#0b103e] px-8 py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{editingProduct ? "Edit Product" : "New Product"}</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Will appear on the Buy Materials page</p>
                </div>
                <button onClick={() => setShowProductModal(false)} className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                {[
                  { label: "Product Name *", key: "name", type: "text", placeholder: "e.g. Portland Cement 42.5R" },
                  { label: "Short Description", key: "shortDescription", type: "text", placeholder: "Brief product description" },
                  { label: "Category", key: "category", type: "text", placeholder: "e.g. Structural Materials" },
                  { label: "Price (NGN, in kobo) *", key: "price", type: "number", placeholder: "e.g. 18500" },
                  { label: "Image URL", key: "image", type: "text", placeholder: "/assets/design/product-cement.png" },
                  { label: "Badge Text", key: "badge", type: "text", placeholder: "e.g. new, sale, hot" },
                  { label: "Homepage Slot", key: "homepageSlot", type: "text", placeholder: "e.g. best-seller, featured" },
                  { label: "Initial Stock Level", key: "stockLevel", type: "number", placeholder: "100" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      value={(productForm as any)[key]}
                      onChange={(e) => setProductForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full h-12 rounded-xl border border-slate-200 bg-[#F8F9FB] px-4 text-sm font-bold text-[#0b103e] focus:ring-4 focus:ring-blue-50 focus:border-[#1900ff] outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setProductForm(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`h-6 w-11 rounded-full transition-all relative ${productForm.featured ? 'bg-[#1900ff]' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${productForm.featured ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#0b103e] transition-colors">Mark as Featured</span>
                </label>
              </div>
              <div className="px-8 py-6 bg-[#F6F7FD] border-t border-slate-100 flex items-center gap-3 justify-end">
                <button onClick={() => setShowProductModal(false)} className="h-12 px-6 rounded-xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                <button
                  onClick={handleSaveProduct}
                  disabled={productSaving}
                  className="h-12 px-8 rounded-xl bg-[#1900ff] text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#0b103e] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {productSaving ? "Saving…" : editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
