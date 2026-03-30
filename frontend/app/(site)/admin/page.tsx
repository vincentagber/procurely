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
  Search
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-brand-blue)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Admin Nav */}
          <aside className="w-full md:w-64">
            <div className="sticky top-24 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Menu
              </p>
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "overview" 
                  ? "bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]" 
                  : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard size={20} />
                Overview
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "orders" 
                  ? "bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]" 
                  : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <ShoppingBag size={20} />
                Orders
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === "users" 
                  ? "bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]" 
                  : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Users size={20} />
                Users
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            <header className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-brand-navy)] capitalize">
                  {activeTab}
                </h1>
                <p className="text-sm text-slate-500">Manage your platform results and activities</p>
              </div>
              <div className="flex items-center gap-2">
                 <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50">
                    <Search size={18} className="text-slate-500" />
                 </button>
                 <div className="h-8 w-[1px] bg-slate-200" />
                 <div className="flex items-center gap-3 pl-2">
                    <div className="text-right">
                       <p className="text-sm font-bold text-[var(--color-brand-navy)]">{user.fullName}</p>
                       <p className="text-[10px] font-bold uppercase text-[var(--color-brand-blue)]">Admin Account</p>
                    </div>
                 </div>
              </div>
            </header>

            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "blue" },
                    { label: "Total Revenue", value: `N${((stats?.totalRevenue || 0) / 100).toLocaleString()}`, icon: BarChart, color: "emerald" },
                    { label: "Active Users", value: stats?.totalUsers || 0, icon: Users, color: "orange" },
                    { label: "Pending Quotes", value: stats?.pendingQuotes || 0, icon: Package, color: "purple" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-xl font-bold text-[var(--color-brand-navy)]">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">Recent Orders</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.order_number} className="flex items-center justify-between rounded-xl border border-slate-50 p-4 transition hover:bg-slate-50">
                           <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full ${order.status === 'paid' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                              <div>
                                <p className="text-sm font-bold text-[var(--color-brand-navy)]">#{order.order_number}</p>
                                <p className="text-[10px] font-medium text-slate-500">{order.customer_name}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-bold text-[var(--color-brand-navy)]">N{(order.total / 100).toLocaleString()}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                     <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[var(--color-brand-navy)]">New Customers</h3>
                      <button onClick={() => setActiveTab("users")} className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                       {users.slice(0, 5).map((user) => (
                          <div key={user.uuid} className="flex items-center justify-between rounded-xl border border-slate-50 p-4 transition hover:bg-slate-50">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                                   {user.full_name.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-[var(--color-brand-navy)]">{user.full_name}</p>
                                   <p className="text-[10px] font-medium text-slate-500">{user.email}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400">{format(new Date(user.created_at), "MMM d")}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Number</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.order_number} className="transition hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-bold text-[var(--color-brand-navy)]">#{order.order_number}</td>
                        <td className="px-6 py-4">
                           <p className="text-sm font-semibold text-[var(--color-brand-navy)]">{order.customer_name}</p>
                           <p className="text-xs text-slate-500">{order.customer_email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(order.created_at), "MMM d, yyyy")}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[var(--color-brand-navy)]">N{(order.total / 100).toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <select 
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.order_number, e.target.value)}
                            className={`rounded-full px-3 py-1 text-xs font-bold border-none transition cursor-pointer ${
                              order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                            }`}
                           >
                              <option value="processing">Processing</option>
                              <option value="paid">Paid</option>
                              <option value="shipped">Shipped</option>
                              <option value="cancelled">Cancelled</option>
                           </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[var(--color-brand-blue)] hover:text-[var(--color-brand-navy)] transition">
                             <ChevronRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "users" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.uuid} className="transition hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-bold text-[var(--color-brand-navy)]">{u.full_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                        <td className="px-6 py-4">
                           <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                           }`}>
                              {u.role}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
