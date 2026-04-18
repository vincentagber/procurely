"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";
import { SuccessModal } from "@/components/account/success-modal";
import { AuthenticatorModal } from "@/components/account/authenticator-modal";
import { ChangePasswordModal } from "@/components/account/change-password-modal";

export default function SettingsClient() {
   const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile Information");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title?: string; message: string }>({
    isOpen: false,
    message: ""
  });

  // Form States
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    whatsapp: ""
  });

  const [companyData, setCompanyData] = useState({
    name: "",
    taxId: "",
    businessType: "",
    email: "",
    whatsapp: "",
    address: ""
  });

  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    setHasMounted(true);
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.fullName?.split(' ')[0].toLowerCase() || "",
        phone: user.phone || "",
        whatsapp: user.whatsapp || ""
      });
      fetchCompanyInfo();
      fetchAddresses();
    }
  }, [user]);

  const fetchCompanyInfo = async () => {
    try {
      const info = await api.getCompanyInfo();
      if (info) {
        setCompanyData({
          name: info.company_name || "",
          taxId: info.tax_id || "",
          businessType: info.business_type || "",
          email: info.email || "",
          whatsapp: info.whatsapp || "",
          address: info.address || ""
        });
      }
    } catch (err) {
      console.error("Failed to fetch company info", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await api.updateProfile(profileData);
      await refreshUser();
      setSuccessModal({
        isOpen: true,
        message: "Your profile information has been successfully updated."
      });
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateCompany = async () => {
    setIsUpdating(true);
    try {
      await api.updateCompany(companyData);
      setSuccessModal({
        isOpen: true,
        message: "Your company information has been successfully updated."
      });
    } catch (err) {
      alert("Failed to update company details.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEnable2FA = async (code: string) => {
    setIsUpdating(true);
    try {
      // Simulation of 2FA enablement
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAuthModalOpen(false);
      setSuccessModal({
        isOpen: true,
        message: "Two-factor authentication has been successfully enabled on your account."
      });
    } catch (err) {
      alert("Failed to enable 2FA.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (data: any) => {
    setIsUpdating(true);
    try {
      // Simulation of password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPasswordModalOpen(false);
      setSuccessModal({
        isOpen: true,
        message: "Your password has been successfully changed."
      });
    } catch (err) {
      alert("Failed to change password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = async (formData: any) => {
    try {
      await api.addAddress(formData);
      fetchAddresses();
    } catch (err) {
      alert("Failed to add address.");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      alert("Failed to delete address.");
    }
  };

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

        <SuccessModal
          isOpen={successModal.isOpen}
          title={successModal.title}
          message={successModal.message}
          onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))}
        />

        <AuthenticatorModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onEnable={handleEnable2FA}
          isLoading={isUpdating}
        />

        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onConfirm={handleChangePassword}
          isLoading={isUpdating}
        />

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
                      <InputField 
                        label="Full name" 
                        value={profileData.fullName} 
                        onChange={(val: string) => setProfileData(prev => ({ ...prev, fullName: val }))} 
                      />
                      <InputField 
                        label="Email" 
                        value={profileData.email} 
                        type="email" 
                        onChange={(val: string) => setProfileData(prev => ({ ...prev, email: val }))} 
                      />
                      <InputField 
                        label="Username" 
                        value={profileData.username} 
                        onChange={(val: string) => setProfileData(prev => ({ ...prev, username: val }))} 
                      />
                      
                      <div className="flex flex-col space-y-2">
                         <label className="text-[12px] font-bold text-slate-600">Phone number</label>
                         <div className="flex items-center">
                            <span className="h-12 flex items-center px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-[13px] font-medium text-slate-500 shadow-sm shrink-0">+234</span>
                            <input 
                              type="text" 
                              className="h-12 w-full bg-white border border-slate-200 rounded-r-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                              value={profileData.phone} 
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                         </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                         <label className="text-[12px] font-bold text-slate-600">Role</label>
                         <div className="relative">
                            <input type="text" className="h-12 w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-slate-500 shadow-sm outline-none cursor-not-allowed pr-10" value={user?.roles?.[0] || "User"} readOnly />
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                         </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                         <label className="text-[12px] font-bold text-slate-600">WhatsApp Number</label>
                         <div className="flex items-center">
                            <span className="h-12 flex items-center px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-[13px] font-medium text-slate-500 shadow-sm shrink-0">+234</span>
                            <input 
                              type="text" 
                              className="h-12 w-full bg-white border border-slate-200 rounded-r-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                              value={profileData.whatsapp} 
                              onChange={(e) => setProfileData(prev => ({ ...prev, whatsapp: e.target.value }))}
                            />
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
                            <button 
                              onClick={() => setIsAuthModalOpen(true)}
                              className="text-[12px] font-bold text-[#1D4ED8] hover:underline whitespace-nowrap"
                            >
                              Set Up
                            </button>
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
                            <button 
                              onClick={() => setIsPasswordModalOpen(true)}
                              className="h-10 px-5 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-lg text-[12px] font-bold shadow-md transition-colors shrink-0 whitespace-nowrap"
                            >
                               Change Password
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="mt-12 flex items-center gap-6">
                      <button 
                        className="h-12 px-8 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-50"
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                      >
                         {isUpdating ? "Updating..." : "Update Profile"}
                      </button>
                      <button 
                        className="h-12 px-6 text-slate-500 hover:text-[#0A1140] text-[13px] font-bold transition-colors"
                        onClick={() => refreshUser()}
                      >
                         Reset
                      </button>
                   </div>
                </div>
             )}

             {activeTab === "Company Details" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   
                   {/* Company Details Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                      <InputField 
                        label="Company Name" 
                        value={companyData.name} 
                        onChange={(val: string) => setCompanyData(prev => ({ ...prev, name: val }))}
                      />
                      <InputField 
                        label="Tax ID (TIN)" 
                        value={companyData.taxId} 
                        onChange={(val: string) => setCompanyData(prev => ({ ...prev, taxId: val }))}
                      />
                      
                      <div className="flex flex-col space-y-2">
                         <label className="text-[12px] font-bold text-slate-600">Business Type</label>
                         <div className="relative">
                            <input 
                              type="text" 
                              className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm outline-none pr-10 cursor-pointer" 
                              value={companyData.businessType} 
                              readOnly 
                            />
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" />
                         </div>
                      </div>
                      
                      <InputField 
                        label="Company Email Address" 
                        value={companyData.email} 
                        type="email" 
                        onChange={(val: string) => setCompanyData(prev => ({ ...prev, email: val }))}
                      />

                      <div className="flex flex-col space-y-2">
                         <label className="text-[12px] font-bold text-slate-600">Role</label>
                         <div className="relative">
                            <input type="text" className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm outline-none pr-10 cursor-pointer" value={user?.roles?.[0] || "User"} readOnly />
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" />
                         </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                         <label className="text-[12px] font-bold text-slate-600">WhatsApp Number</label>
                         <div className="flex items-center">
                            <span className="h-12 flex items-center px-4 bg-slate-50 border border-slate-200 border-r-0 rounded-l-xl text-[13px] font-medium text-slate-500 shadow-sm shrink-0">+234</span>
                            <input 
                              type="text" 
                              className="h-12 w-full bg-white border border-slate-200 rounded-r-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                              value={companyData.whatsapp} 
                              onChange={(e) => setCompanyData(prev => ({ ...prev, whatsapp: e.target.value }))}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="mt-8">
                      <label className="text-[12px] font-bold text-slate-600 block mb-2">Office Address</label>
                      <textarea 
                         className="w-full bg-white border border-slate-200 rounded-xl p-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                         value={companyData.address}
                         onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                      />
                   </div>

                   {/* Action Buttons */}
                   <div className="mt-10">
                      <button 
                        className="h-12 px-8 bg-[#1D4ED8] hover:bg-blue-800 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-blue-500/20 transition-all focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 whitespace-nowrap disabled:opacity-50"
                        onClick={handleUpdateCompany}
                        disabled={isUpdating}
                      >
                         {isUpdating ? "Updating..." : "Update Company Info"}
                      </button>
                   </div>
                </div>
             )}

             {activeTab === "Delivery Address" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {addresses.map((addr, i) => (
                         <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                            {addr.is_default === 1 && (
                               <span className="absolute top-4 right-4 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">Default</span>
                            )}
                            <h4 className="text-[14px] font-black text-[#0A1140] uppercase tracking-wider mb-2">{addr.label}</h4>
                            <p className="text-[12px] font-medium text-slate-500 leading-relaxed mb-6">{addr.address}</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                               <button className="text-[11px] font-bold text-[#1D4ED8]">Edit</button>
                               <button 
                                 className="text-[11px] font-bold text-rose-500"
                                 onClick={() => handleDeleteAddress(addr.id)}
                               >
                                  Delete
                               </button>
                            </div>
                         </div>
                      ))}

                      {/* Add New Card */}
                      <button 
                        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-[#1D4ED8] transition-all group min-h-[160px]"
                        onClick={() => {
                          const label = prompt("Address Label (e.g. Home, Office)");
                          const address = prompt("Full Address");
                          if (label && address) handleAddAddress({ label, address, isDefault: addresses.length === 0 ? 1 : 0 });
                        }}
                      >
                         <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <Plus size={24} />
                         </div>
                         <span className="text-[12px] font-bold">Add New Address</span>
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
                      <button
                        onClick={() => router.push("/account/wallet")}
                        className="h-11 px-6 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-xl text-[12px] font-bold shadow-md transition-colors flex items-center gap-2"
                      >
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

function InputField({ label, value, onChange, type = "text" }: any) {
   return (
      <div className="flex flex-col space-y-2">
         <label className="text-[12px] font-bold text-slate-600">{label}</label>
         <input 
            type={type} 
            className="h-12 w-full bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-medium text-[#0A1140] shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300" 
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
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
