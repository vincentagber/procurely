"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  History,
  Settings,
  Search,
  Plus,
  CreditCard,
  Gift,
  FileText,
  Clock,
  Building,
  FileDown,
  Filter,
  CheckSquare,
  ChevronDown,
  Calendar,
  Download,
  CheckCircle2
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";
import { FundWalletModal } from "@/components/account/fund-wallet-modal";
import { WithdrawalModal } from "@/components/account/withdrawal-modal";
import { SuccessModal } from "@/components/account/success-modal";

export default function WalletClient() {
  const { user, refreshUser } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title?: string; message: string }>({
    isOpen: false,
    message: ""
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
  }

  const tableTabs = ["All", "Funded", "Withdrawn", "Payments", "Bonus", "Fees"];

  const handleFundWallet = async (amount: number) => {
    try {
      setIsLoading(true);
      const res = await api.fundWallet({ amount: Math.round(amount * 100) });
      if (res.authorization_url) {
        window.location.href = res.authorization_url;
      } else {
        await refreshUser();
        setSuccessModal({
          isOpen: true,
          title: "Transfer Successful",
          message: `₦${amount.toLocaleString()} has been successfully added to your wallet.`
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to initialize funding.");
    } finally {
      setIsLoading(false);
      setIsFundModalOpen(false);
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      await refreshUser();
      setIsWithdrawModalOpen(false);
      setSuccessModal({
        isOpen: true,
        title: "Withdraw Successful",
        message: `₦${amount.toLocaleString()} has been credited your bank account.`
      });
    } catch (err: any) {
      alert("Failed to process withdrawal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-8 min-h-screen bg-[#F8FAFF]">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
        <span className="hover:text-slate-900 cursor-pointer">Account</span>
        <span className="text-slate-300">/</span>
        <span className="text-[#0001FF] font-semibold">Wallet & Payments</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        
        {/* LEFT COLUMN: Main Wallet View */}
        <div className="flex flex-col gap-8">
          
          {/* Balance Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-2 tracking-wide uppercase">Total Balance</p>
                <h1 className="text-4xl font-extrabold text-[#0A1140]">₦380,000.00</h1>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Clock size={14} />
                    <span>Updated Just now</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setIsFundModalOpen(true)}
                  className="flex-1 md:px-8 h-12 bg-[#0001FF] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100"
                >
                  Fund Wallet
                </button>
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="flex-1 md:px-8 h-12 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
                >
                  Withdraw
                </button>
              </div>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Recent Funding</p>
                <p className="text-xl font-black text-[#0A1140]">+₦50,000</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Payments Made</p>
                <p className="text-xl font-black text-[#0A1140]">₦35,000</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Bonus Credits</p>
                <p className="text-xl font-black text-[#0A1140]">₦5,400</p>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-black text-[#0A1140]">Transaction History</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-full md:w-64" 
                  />
                </div>
                <button className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-sm font-bold text-slate-600">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <Plus size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#0A1140]">Wallet Funding</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">Today, 11:30 AM</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap"><span className="text-sm font-black text-[#0A1140]">₦50,000.00</span></td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] border border-emerald-100 gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 size={12} /> Success
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#0A1140]">Order Payment</p>
                          <p className="text-[11px] font-bold text-slate-400 mt-0.5">Feb 14, 2024</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap"><span className="text-sm font-black text-red-600">-₦35,000.00</span></td>
                    <td className="px-6 py-5 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] border border-blue-100 gap-1.5 uppercase tracking-wide">
                        <CheckCircle2 size={12} /> Success
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 border-t border-slate-50 flex justify-center">
              <button className="text-sm font-black text-[#0001FF] hover:underline uppercase tracking-widest">
                Load More History
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-[#0A1140] mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-[#0001FF]" /> Payment Methods
            </h3>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-[#0A1140]">Visa •••• 4242</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">Expires 12/26</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <button className="w-full py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <Plus size={14} /> Add New Method
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-black text-[#0A1140] mb-6 flex items-center gap-2">
              <History size={18} className="text-[#0001FF]" /> Quick Actions
            </h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group">
                <FileText size={18} className="text-slate-400 group-hover:text-[#0001FF]" />
                <span className="text-xs font-bold text-slate-600">Download Reports</span>
              </button>
              <button className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group">
                <Settings size={18} className="text-slate-400 group-hover:text-[#0001FF]" />
                <span className="text-xs font-bold text-slate-600">Limit Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FundWalletModal 
        isOpen={isFundModalOpen} 
        onClose={() => setIsFundModalOpen(false)} 
        onConfirm={handleFundWallet} 
        isLoading={isLoading} 
      />
      <WithdrawalModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
        onConfirm={handleWithdraw} 
        isLoading={isLoading} 
      />
      <SuccessModal 
        isOpen={successModal.isOpen} 
        title={successModal.title} 
        message={successModal.message} 
        onClose={() => setSuccessModal(prev => ({ ...prev, isOpen: false }))} 
      />
    </div>
  );
}
