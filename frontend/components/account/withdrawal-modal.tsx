"use client";

import React, { useState, FormEvent, MouseEvent } from "react";
import { X, Lock, Landmark } from "lucide-react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isLoading?: boolean;
}

export function WithdrawalModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState<string>("100,000");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    onConfirm(numAmount);
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative flex flex-col bg-[#FFFFFF] rounded-[16px] w-[400px] h-[550px] p-6 lg:p-7 overflow-hidden z-10"
        style={{
          boxShadow: '0px 8px 8px -4px #0000000A, 0px 20px 24px -4px #0000001A'
        }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start mb-5">
          <div className="w-[52px] h-[52px] bg-[#F9F5FF] rounded-full flex items-center justify-center">
            {/* Custom Withdraw Icon approximation */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3F2B96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
              <path d="M12 4v12" />
              <path d="m8 12 4 4 4-4" />
              <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
            </svg>
          </div>
          <button 
            onClick={onClose}
            className="p-1 -mr-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Titles */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Withdrawal</h3>
          <p className="text-[0.875rem] text-gray-500 font-medium pr-2">
            Enter the amount you want to withdraw from your wallet.
          </p>
        </div>

        {/* Current Balance Box */}
        <div className="border border-gray-200 rounded-[12px] p-4 mb-4">
          <p className="text-[0.813rem] font-medium text-gray-500 mb-0.5">Current Balance</p>
          <div className="text-[2rem] leading-none font-bold text-[#10A958] tracking-tight">
            N50,000
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-[0.875rem] font-bold text-[#374151] mb-2">Amount</label>
          <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
            <span className="text-gray-600 font-medium text-[0.938rem] mt-px">
              N <span className="mx-1.5 text-gray-300 font-light">|</span>
            </span>
            <input 
              type="text" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 h-full outline-none bg-transparent font-semibold text-gray-900 text-[0.938rem] mt-px"
              placeholder="0"
            />
          </div>
        </div>

        {/* Destination Bank Output (Label uses 'Amount' exactly as shown in screenshot) */}
        <div className="mb-2">
          <label className="block text-[0.875rem] font-bold text-[#374151] mb-2">Amount</label>
          <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3">
            <Landmark size={18} className="text-[#374151]" strokeWidth={2.5} />
            <span className="text-gray-300 font-light mx-2">|</span>
            <span className="flex-1 font-medium text-gray-800 text-[0.938rem] truncate">
              Gibson Bank - 123 456 7890
            </span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex gap-3 mb-5 mt-4">
          <button 
            onClick={onClose}
            type="button"
            className="flex-1 h-11 border border-gray-300 bg-white rounded-[8px] text-[0.938rem] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 h-11 bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Withdraw"}
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 text-gray-500 mt-auto">
          <Lock size={14} strokeWidth={2.5} />
          <span className="text-[0.75rem] font-medium">Your payment is secure and encrypted.</span>
        </div>

      </div>
    </div>
  );
}
