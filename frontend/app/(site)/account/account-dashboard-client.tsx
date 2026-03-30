"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  CircleUser, LayoutDashboard, Package, Settings, LogOut, 
  MapPin, Mail, Phone, CreditCard, ChevronRight,
  TrendingUp, Clock, CheckCircle2, ShoppingBag, 
  ArrowUpRight, ExternalLink, Target, Shield
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useRouter } from "next/navigation";

type AuthUser = { id: string; fullName: string; email: string };

const ORDER_HISTORY_KEY = "procurely-order-history";
type StoredOrderRef = { orderNumber: string; cartToken: string; placedAt: string };

export default function AccountDashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orderRefs, setOrderRefs] = useState<StoredOrderRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("procurely-auth-user");
      const storedRefs = window.sessionStorage.getItem(ORDER_HISTORY_KEY);
      
      if (storedUser) {
        const u = JSON.parse(storedUser) as AuthUser;
        setUser(u);
        setEditForm({ fullName: u.fullName, email: u.email });
      }
      
      if (storedRefs) {
        setOrderRefs(JSON.parse(storedRefs) as StoredOrderRef[]);
      }
    } catch {
      // Degrade silently
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("procurely-auth-token");
    window.localStorage.removeItem("procurely-auth-user");
    router.push("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const resp = await api.updateProfile(editForm);
      window.localStorage.setItem("procurely-auth-user", JSON.stringify(resp.user));
      setUser(resp.user);
      setIsEditing(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="size-8 animate-spin border-4 border-[#1900ff] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="size-20 bg-[#f0f1fa] rounded-full flex items-center justify-center text-[#1900ff] mb-8">
           <CircleUser className="size-10" />
        </div>
        <h2 className="text-2xl font-black text-[#13184f] mb-3">Login Required</h2>
        <p className="text-slate-500 font-medium mb-10 max-w-sm">Please sign in to access your secure developer dashboard.</p>
        <Link href="/login" className="px-10 h-14 bg-[#1900ff] text-white font-bold rounded-2xl flex items-center transition hover:bg-[#1310cc]">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#13184f] p-10 sm:p-14 text-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#1900ff]/20 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/70 text-[11px] font-bold uppercase tracking-widest mb-6">
                Developer Dashboard
              </span>
              
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-white/40 block mb-1.5 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editForm.fullName}
                      onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 h-12 text-white font-bold outline-none focus:border-[#1900ff]/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-white/40 block mb-1.5 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 h-12 text-white font-bold outline-none focus:border-[#1900ff]/60"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="h-11 px-6 bg-[#1900ff] text-white font-bold rounded-xl text-sm disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="h-11 px-6 bg-white/10 text-white font-bold rounded-xl text-sm border border-white/15"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-4">
                    Welcome back, <br/>
                    <span className="text-[#1900ff] brightness-150">{user.fullName.split(" ")[0]}</span>
                  </h1>
                  <p className="text-white/50 font-medium flex items-center gap-2">
                    <Mail className="size-3.5" /> {user.email}
                  </p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-6 text-[11px] font-bold uppercase tracking-wider text-[#1900ff] brightness-150 flex items-center gap-1.5 hover:underline"
                  >
                    <Settings className="size-3" /> Edit Profile
                  </button>
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
               <Link href="/materials" className="h-14 px-8 bg-white text-[#13184f] font-bold rounded-2xl flex items-center justify-center shadow-lg transition hover:-translate-y-1">
                 Order Materials <ShoppingBag className="size-4 ml-2" />
               </Link>
               <button onClick={handleLogout} className="h-14 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl flex items-center justify-center border border-white/15 transition">
                 Sign Out <LogOut className="size-4 ml-2" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Stats/Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Orders Overview */}
          <div className="rounded-[2rem] bg-white border border-slate-100 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#f0f1fa] text-[#1900ff] flex items-center justify-center">
                     <Package className="size-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#13184f] tracking-tight">Recent Orders</h3>
               </div>
               <Link href="/account/orders" className="text-sm font-bold text-[#1900ff] hover:underline flex items-center gap-1">
                  View full history <ChevronRight className="size-4" />
               </Link>
            </div>

            {orderRefs.length > 0 ? (
              <div className="space-y-4">
                {orderRefs.slice(0, 3).map((ref) => (
                  <Link 
                    key={ref.orderNumber} 
                    href={`/account/orders/${ref.orderNumber}`}
                    className="flex items-center justify-between p-5 rounded-2xl border border-transparent hover:border-[#f0f1fa] hover:bg-[#f6f7fd]/50 transition group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="size-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#1900ff] transition-colors">
                          <Clock className="size-5" />
                       </div>
                       <div>
                          <p className="font-bold text-[#13184f]">Order #{ref.orderNumber}</p>
                          <p className="text-xs font-medium text-slate-400">Placed on {new Date(ref.placedAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <ArrowUpRight className="size-5 text-slate-300 transition group-hover:text-[#1900ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                 <p className="text-slate-400 font-medium mb-6">No recent procurement activity found.</p>
                 <Link href="/materials" className="text-[#1900ff] font-bold text-sm border-b-2 border-transparent hover:border-[#1900ff] transition pb-0.5">Start an order</Link>
              </div>
            )}
          </div>

          {/* Featured Services/Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="rounded-[2rem] bg-gradient-to-br from-[#fde8df] to-white p-8 border border-[#fde8df]/30 relative overflow-hidden group">
                <Target className="absolute top-[-20px] right-[-20px] size-40 opacity-5 transition-transform group-hover:scale-110" />
                <h4 className="text-xl font-black text-[#13184f] mb-2">Track Credit</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Manage your structured payment cycles and remaining limits.</p>
                <button className="text-[13px] font-bold text-[#ff6f4d] uppercase tracking-wider flex items-center gap-1.5 opacity-60 pointer-events-none">
                  Coming Soon <Clock className="size-3.5" />
                </button>
             </div>
             <div className="rounded-[2rem] bg-gradient-to-br from-[#e8fbf1] to-white p-8 border border-[#e8fbf1]/30 relative overflow-hidden group">
                <Shield className="absolute top-[-20px] right-[-20px] size-40 opacity-5 transition-transform group-hover:scale-110" />
                <h4 className="text-xl font-black text-[#13184f] mb-2">Manage Sites</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">Aggregate multiple delivery locations and construction projects.</p>
                <button className="text-[13px] font-bold text-[#059669] uppercase tracking-wider flex items-center gap-1.5 opacity-60 pointer-events-none">
                  In Development <TrendingUp className="size-3.5" />
                </button>
             </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
           
           {/* Quick Actions List */}
           <div className="rounded-[2rem] bg-white border border-slate-100 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
              <h3 className="text-lg font-black text-[#13184f] mb-6 tracking-tight">Quick Actions</h3>
              <div className="space-y-4">
                 {[
                   { label: "My Profile", icon: CircleUser, href: "#profile" },
                   { label: "Address Book", icon: MapPin, href: "#addresses" },
                   { label: "Payment Info", icon: CreditCard, href: "#billing" },
                   { label: "Security & App", icon: Settings, href: "#security" },
                 ].map((item) => (
                   <button 
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl text-slate-500 hover:bg-[#f6f7fd] hover:text-[#1900ff] transition-all group"
                   >
                     <div className="flex items-center gap-3">
                        <item.icon className="size-4.5" />
                        <span className="text-sm font-bold tracking-tight">{item.label}</span>
                     </div>
                     <ChevronRight className="size-4 opacity-0 transition group-hover:opacity-100 group-hover:translate-x-0.5" />
                   </button>
                 ))}
              </div>
           </div>

           {/* Support Card */}
           <div className="rounded-[2rem] bg-[#1900ff] p-8 text-white relative overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] size-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                 <h4 className="font-black text-lg mb-2">Need assistance?</h4>
                 <p className="text-white/60 text-[13px] font-medium leading-relaxed mb-8">
                    Our dedicated procurement managers are available 24/7 to help with complex BOMs or tracking.
                 </p>
                 <Link href="/contact-quote" className="flex items-center gap-3 text-sm font-bold hover:gap-4 transition-all">
                    Talk to an Expert <ExternalLink className="size-4" />
                 </Link>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
