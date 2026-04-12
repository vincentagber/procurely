"use client";

import React, { useState } from "react";
import { X, CreditCard, ShieldCheck, Wallet } from "lucide-react";

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isLoading: boolean;
}

export function FundWalletModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: FundWalletModalProps) {
  const [amount, setAmount] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    onConfirm(numAmount);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0A1140]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(10,17,64,0.15)] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1D4ED8] shadow-sm">
              <Wallet size={24} />
            </div>
            <div>
              <h3 className="text-[1.25rem] font-black text-[#0A1140] tracking-tight">Fund Wallet</h3>
              <p className="text-[0.875rem] text-slate-500 font-medium">Add balance to your procurement account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-[#0A1140]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-[0.75rem] font-black uppercase tracking-widest text-slate-400 block ml-1">
              Enter Amount (NGN)
            </label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[1.125rem] font-bold text-[#0A1140]">₦</div>
              <input
                autoFocus
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-[64px] pl-10 pr-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-[1.25rem] font-black text-[#0A1140] focus:border-[#1D4ED8] focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-inner group-hover:border-slate-200"
                required
              />
            </div>
          </div>

          {/* Quick Selections */}
          <div className="grid grid-cols-3 gap-3">
            {["10000", "50000", "100000"].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className="py-2.5 rounded-xl border border-slate-200 text-[0.813rem] font-bold text-[#0A1140] hover:border-[#1D4ED8] hover:text-[#1D4ED8] hover:bg-blue-50 transition-all active:scale-[0.97]"
              >
                + ₦{parseInt(val).toLocaleString()}
              </button>
            ))}
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl p-4 flex items-start gap-4">
            <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[0.75rem] text-slate-500 leading-relaxed font-medium">
              Transactions are securely processed via <span className="font-bold text-[#0A1140]">Paystack</span>. Your financial details are never stored on our servers.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[60px] bg-[#0A1140] hover:bg-[#060b2d] disabled:bg-slate-300 text-white rounded-[1.125rem] text-[1.125rem] font-bold flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(10,17,64,0.2)] hover:shadow-[0_15px_35px_rgba(10,17,64,0.25)] transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard size={20} />
                Continue to Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
