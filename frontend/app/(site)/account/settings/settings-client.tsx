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
  Menu,
  ChevronRight,
  Upload,
  ChevronDown,
  CheckCircle2,
  Lock,
  Plus,
  Building,
  CreditCard,
  CheckSquare
} from "lucide-react";

export default function SettingsClient() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile Information");

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
  }

  return (
    <div className="space-y-8 min-w-0">
               
       {/* Unified Breadcrumb Strip */}
       <div className="mb-6 flex items-center gap-2 text-[12px] font-bold tracking-wide flex-wrap">
          <span className="text-slate-400">Home</span> 
          <span className="text-slate-300">/</span> 
          <span className="text-slate-400">Account</span> 
          <span className="text-slate-300">/</span> 
          <span className="text-[#0A1140] cursor-pointer hover:underline" onClick={() => setActiveTab("Profile Information")}>Account Settings</span>
          <span className="text-slate-300">/</span> 
          <span className="text-[#1D4ED8]">{activeTab}</span>
       </div>

               {/* Header Section */}
               <div className="space-y-2 mb-8">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight">
                     {activeTab === "Delivery Address" ? "Delivery Addresses" 
                        : activeTab === "Notifications" ? "Notifications" : activeTab}
                  </h1>
                  <p className="text-[13px] font-medium text-slate-500">
                     {activeTab === "Company Details" 
                        ? "Manage your company information and billing details" 
                        : activeTab === "Delivery Address"
                        ? "Manage your locations for delivery and shipping"
                        : activeTab === "Payment Methods"
                        ? "Manage your saved bank accounts and cards"
                        : activeTab === "Notifications"
                        ? "Manage your communication preferences"
                        : "Manage your profile, company details, and system preferences"}
                  </p>
               </div>

               {/* Form Card */}
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  
                  {/* Settings Tabs */}
                  <div className="flex overflow-x-auto border-b border-slate-100 px-6 scrollbar-hide">
                     <TabItem label="Profile Information" active={activeTab === "Profile Information"} onClick={() => setActiveTab("Profile Information")} />
                     <TabItem label="Company Details" active={activeTab === "Company Details"} onClick={() => setActiveTab("Company Details")} />
                     <TabItem label="Delivery Address" active={activeTab === "Delivery Address"} onClick={() => setActiveTab("Delivery Address")} />
                     <TabItem label="Payment Methods" active={activeTab === "Payment Methods"} onClick={() => setActiveTab("Payment Methods")} />
                     <TabItem label="Notifications" active={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} />
                  </div>

                  <div className="p-8 lg:p-10 max-w-5xl">

                     {activeTab === "Profile Information" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <h4 className="text-[13px] font-bold text-slate-400 mb-4">Your Profile Picture</h4>
                           
                           <div className="w-[100px] h-[100px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-all mb-10 group">
                              <Upload size={24} className="mb-2 group-hover:text-blue-500" strokeWidth={1.5} />
                              <span className="text-[9px] font-bold uppercase tracking-wider group-hover:text-blue-500 text-center px-2 leading-tight">Upload your photo</span>
                           </div>

                           <div className="border-t border-slate-100 my-8"></div>

                           {/* Profile Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                              <InputField label="Full name" defaultValue="Olusegun Akapo" />
                              <InputField label="Email" defaultValue="Olusegun@email.com" type="email" />
                              <InputField label="Username" defaultValue="Doola" />
                              
                              <div className="flex flex-col space-y-2">
                                 <label className="text-[12px] font-bold text-slate-600">Phone number</label>
                                 <div className="flex items-center">
                                    <span className="h-12 flex items-center px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-[13px] font-medium text-slate-500 shadow-sm shrink-0">+234</span>
                                    <input type="text" className="h-12 w-full bg-white border border-slate-200 rounded-r-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" defaultValue="800 000 0000" />
                                 </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                 <label className="text-[12px] font-bold text-slate-600">Role</label>
                                 <div className="relative">
                                    <input type="text" className="h-12 w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-slate-500 shadow-sm outline-none cursor-not-allowed pr-10" value="Procurement Manager" readOnly />
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                 </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                 <label className="text-[12px] font-bold text-slate-600">WhatsApp Number</label>
                                 <div className="flex items-center">
                                    <span className="h-12 flex items-center px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-[13px] font-medium text-slate-500 shadow-sm shrink-0">+234</span>
                                    <input type="text" className="h-12 w-full bg-white border border-slate-200 rounded-r-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" defaultValue="800 000 0000" />
                                 </div>
                              </div>
                           </div>

                           {/* Security Section */}
                           <h4 className="text-[14px] font-bold text-[#0A1140] mt-12 mb-4 tracking-tight">Security</h4>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* 2FA Card */}
                              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6">
                                 <div className="flex items-center justify-between xl:flex-row flex-col xl:items-center items-start gap-4 mb-4">
                                    <span className="text-[13px] font-bold text-[#0A1140]">Enable Two-Factor Authentication</span>
                                    <button className="text-[12px] font-bold text-[#1D4ED8] hover:underline whitespace-nowrap">Set Up</button>
                                 </div>
                                 <div className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                                    <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center shrink-0">
                                       <CheckCircle2 size={12} className="text-white" />
                                    </div>
                                    <span className="text-[12px] font-medium text-slate-500">Enable Two-Factor Authentication</span>
                                 </div>
                              </div>

                              {/* Account Security Card */}
                              <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6">
                                 <div className="flex items-center justify-between gap-4 mb-4">
                                    <span className="text-[13px] font-bold text-[#0A1140]">Account Security</span>
                                 </div>
                                 <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                    <Lock size={16} className="text-slate-400 absolute left-4" />
                                    <input type="password" placeholder="Password" className="h-10 w-full bg-transparent pl-12 pr-4 text-[13px] font-medium text-[#0A1140] outline-none" defaultValue="********" />
                                    <button className="h-10 px-5 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-lg text-[12px] font-bold shadow-md transition-colors shrink-0 whitespace-nowrap">
                                       Change Password
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* Action Buttons */}
                           <div className="mt-12 flex items-center gap-6">
                              <button className="h-12 px-8 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 whitespace-nowrap">
                                 Update Profile
                              </button>
                              <button className="h-12 px-6 text-slate-500 hover:text-[#0A1140] text-[13px] font-bold transition-colors">
                                 Reset
                              </button>
                           </div>
                        </div>
                     )}

                     {activeTab === "Company Details" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                           
                           {/* Company Details Grid */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                              <InputField label="Company Name" defaultValue="Procurely Limited" />
                              <InputField label="Tax ID (TIN)" defaultValue="12345678" />
                              
                              <div className="flex flex-col space-y-2">
                                 <label className="text-[12px] font-bold text-slate-600">Business Type</label>
                                 <div className="relative">
                                    <input type="text" className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm outline-none pr-10 cursor-pointer" defaultValue="Construction" readOnly />
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" />
                                 </div>
                              </div>
                              
                              <InputField label="Company Email Address" defaultValue="info@procurely.com" type="email" />

                              <div className="flex flex-col space-y-2">
                                 <label className="text-[12px] font-bold text-slate-600">Role</label>
                                 <div className="relative">
                                    <input type="text" className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm outline-none pr-10 cursor-pointer" defaultValue="Procurement Manager" readOnly />
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" />
                                 </div>
                              </div>

                              <div className="flex flex-col space-y-2">
                                 <label className="text-[12px] font-bold text-slate-600">WhatsApp Number</label>
                                 <div className="flex items-center">
                                    <span className="h-12 flex items-center px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-[13px] font-medium text-slate-500 shadow-sm shrink-0">+234</span>
                                    <input type="text" className="h-12 w-full bg-white border border-slate-200 rounded-r-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" defaultValue="800 000 0000" />
                                 </div>
                              </div>
                           </div>

                           <div className="mt-8">
                              <label className="text-[12px] font-bold text-slate-600 block mb-2">Office Address</label>
                              <textarea 
                                 className="w-full bg-white border border-slate-200 rounded-xl p-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                                 defaultValue="12 Allan Avenue, Ikeja, Lagos, Nigeria"
                              />
                           </div>

                           {/* Action Buttons */}
                           <div className="mt-10">
                              <button className="h-12 px-8 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 whitespace-nowrap">
                                 Update Company Info
                              </button>
                           </div>
                        </div>
                     )}

                     {activeTab === "Delivery Address" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <div className="flex flex-col space-y-4">
                              {/* Address Card 1 */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                                 <div>
                                    <h4 className="text-[13px] font-bold text-[#0A1140]">Head Office</h4>
                                    <p className="text-[12px] font-medium text-slate-400 mt-1">12 Allan Avenue, Ikeja Lagos-Nigeria</p>
                                 </div>
                                 <div className="flex items-center gap-3 shrink-0">
                                    <button className="h-8 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-bold transition-colors border border-slate-200">
                                       Edit
                                    </button>
                                    <button className="h-8 px-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[11px] font-bold transition-colors border border-red-100">
                                       Delete
                                    </button>
                                 </div>
                              </div>

                              {/* Address Card 2 */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                                 <div>
                                    <h4 className="text-[13px] font-bold text-[#0A1140]">Site Location 1</h4>
                                    <p className="text-[12px] font-medium text-slate-400 mt-1">Lekki Phase 1, Lagos-Nigeria</p>
                                 </div>
                                 <div className="flex items-center gap-3 shrink-0">
                                    <button className="h-8 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-bold transition-colors border border-slate-200">
                                       Edit
                                    </button>
                                    <button className="h-8 px-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[11px] font-bold transition-colors border border-red-100">
                                       Delete
                                    </button>
                                 </div>
                              </div>

                              {/* Address Card 3 */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                                 <div>
                                    <h4 className="text-[13px] font-bold text-[#0A1140]">Warehouse</h4>
                                    <p className="text-[12px] font-medium text-slate-400 mt-1">42, Adebayo Street, Apapa, Lagos-Nigeria</p>
                                 </div>
                                 <div className="flex items-center gap-3 shrink-0">
                                    <button className="h-8 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-bold transition-colors border border-slate-200">
                                       Edit
                                    </button>
                                    <button className="h-8 px-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-[11px] font-bold transition-colors border border-red-100">
                                       Delete
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* Add New Button */}
                           <div className="mt-8">
                              <button className="h-11 px-6 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-xl text-[12px] font-bold shadow-md transition-colors flex items-center gap-2">
                                 <Plus size={16} />
                                 Add New Address
                              </button>
                           </div>
                        </div>
                     )}

                     {activeTab === "Payment Methods" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <div className="flex flex-col space-y-4">
                              {/* Payment Method 1 */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                       <Building size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                       <div className="flex items-center gap-1.5">
                                          <h4 className="text-[13px] font-bold text-[#0A1140]">Gibson Bank</h4>
                                          <span className="text-[13px] font-medium text-slate-400">****4682</span>
                                       </div>
                                       <div className="flex items-center gap-1.5 mt-1 text-[#1D4ED8]">
                                          <CheckSquare size={14} className="text-[#1D4ED8]" />
                                          <span className="text-[11px] font-bold">Default</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex items-center shrink-0 mt-3 sm:mt-0">
                                    <button className="h-8 px-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-[11px] font-bold transition-colors border border-slate-200">
                                       Remove
                                    </button>
                                 </div>
                              </div>

                              {/* Payment Method 2 */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                       <CreditCard size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                       <div className="flex items-center gap-1.5">
                                          <h4 className="text-[13px] font-bold text-[#0A1140]">Visa Card</h4>
                                          <span className="text-[13px] font-medium text-slate-400">***8391</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex items-center shrink-0 mt-3 sm:mt-0">
                                    <button className="h-8 px-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg text-[11px] font-bold transition-colors border border-slate-200">
                                       Remove
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* Add New Payment Button */}
                           <div className="mt-8">
                              <button className="h-11 px-6 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-xl text-[12px] font-bold shadow-md transition-colors flex items-center gap-2">
                                 <Plus size={16} />
                                 Add Payment Method
                              </button>
                           </div>
                        </div>
                     )}

                     {activeTab === "Notifications" && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
                           <div className="flex flex-col space-y-4">
                              <NotificationRow label="Email Notifications" defaultChecked={false} />
                              <NotificationRow label="SMS Alert" defaultChecked={false} />
                              <NotificationRow label="Order Updates" defaultChecked={false} />
                              <NotificationRow label="Payments Alerts" defaultChecked={false} />
                           </div>
                        </div>
                     )}

                  </div>
               </div>
             </div>
   );
}

// --- Specific Components ---

function TabItem({ label, active = false, onClick }: any) {
   return (
      <button onClick={onClick} className={`h-14 px-6 border-b-2 transition-all shrink-0 text-[13px] font-bold ${
         active ? "border-[#FF5C00] text-[#FF5C00]" : "border-transparent text-slate-400 hover:text-slate-800 hover:border-slate-200"
      }`}>
         {label}
      </button>
   );
}

function InputField({ label, defaultValue, type = "text" }: any) {
   return (
      <div className="flex flex-col space-y-2">
         <label className="text-[12px] font-bold text-slate-600">{label}</label>
         <input 
            type={type} 
            className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" 
            defaultValue={defaultValue} 
         />
      </div>
   );
}

function NotificationRow({ label, defaultChecked = false }: any) {
   const [checked, setChecked] = useState(defaultChecked);
   
   return (
      <div className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl bg-white hover:border-blue-200 transition-all cursor-pointer" onClick={() => setChecked(!checked)}>
         <span className="text-[14px] font-bold text-[#0A1140]">{label}</span>
         
         <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#1D4ED8]' : 'bg-slate-200'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
         </div>
      </div>
   );
}
