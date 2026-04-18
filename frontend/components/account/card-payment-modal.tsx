"use client";

import React, { useState, FormEvent, MouseEvent } from "react";
import { X, Wallet, Lock, CreditCard } from "lucide-react";

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (data: any) => void;
  isLoading?: boolean;
  amount?: string;
}

export function CardPaymentModal({
  isOpen,
  onClose,
  onPay,
  isLoading = false,
  amount = "100,000"
}: CardPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState<string>("123 4 5678 9012 3456");
  const [expiry, setExpiry] = useState<string>("12/5");
  const [cvv, setCvv] = useState<string>("");
  const [saveCard, setSaveCard] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onPay({ cardNumber, expiry, cvv, saveCard });
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
        className="relative flex flex-col bg-[#FFFFFF] rounded-[16px] w-[422px] h-[570px] p-6 lg:p-7 overflow-hidden z-10"
        style={{
          boxShadow: '0px 8px 8px -4px #0000000A, 0px 20px 24px -4px #0000001A'
        }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start mb-5">
          <div className="w-[52px] h-[52px] bg-[#F9F5FF] rounded-full flex items-center justify-center">
            <Wallet size={24} className="text-[#3F2B96]" strokeWidth={2} />
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
          <h3 className="text-[1.125rem] font-bold text-gray-900 tracking-tight">Credit / Debit Card Payment</h3>
          <p className="text-[0.938rem] text-gray-600 mt-1">
            Amount: <span className="text-[#FF4A17] font-bold text-[1.125rem]">N{amount}</span>
          </p>
          <p className="text-[0.875rem] font-medium text-gray-500 mt-1">
            Enter your card details to complete the payment:
          </p>
        </div>

        {/* Card Form Box */}
        <div className="border border-gray-200 rounded-[12px] p-4 bg-white mb-4">
          {/* Label Row */}
          <div className="flex justify-between items-center mb-2">
            <label className="text-[0.813rem] font-bold text-[#6B7280]">Card Number</label>
            <div className="flex items-center gap-3">
              {/* Visa Logo CSS Mock */}
              <div className="text-[1.125rem] italic font-black text-[#1A1F71] tracking-tighter" style={{ fontFamily: "Arial, sans-serif" }}>VISA</div>
              {/* Mastercard Logo CSS Mock */}
              <div className="flex flex-col items-center">
                <div className="flex -space-x-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] relative z-20"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] relative z-10"></div>
                </div>
                <span className="text-[0.2rem] font-bold tracking-widest mt-px text-black">mastercard</span>
              </div>
            </div>
          </div>
          
          <div className="h-10 border border-gray-300 rounded-[6px] px-3 mb-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
            <input 
              type="text" 
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full h-full outline-none bg-transparent font-medium text-gray-800 text-[0.875rem]"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <label className="block text-[0.813rem] font-bold text-[#6B7280] mb-2">Olusegun Akapo</label>
          
          <div className="flex gap-3">
            <div className="flex-1 h-10 border border-gray-300 rounded-[6px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
              <input 
                type="text" 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full h-full outline-none bg-transparent font-medium text-gray-800 text-[0.875rem]"
                placeholder="MM/YY"
              />
            </div>
            
            <div className="flex-1 h-10 border border-gray-300 rounded-[6px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 flex items-center transition-shadow bg-white">
              <input 
                type="text" 
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full h-full outline-none bg-transparent font-medium text-gray-800 text-[0.875rem] placeholder:text-gray-400"
                placeholder="CVV"
              />
              <div className="flex items-center text-gray-400 gap-1.5 ml-2">
                <Lock size={12} strokeWidth={2.5} />
              </div>
              <div className="w-[1px] h-3 bg-gray-200 mx-2"></div>
              <CreditCard size={15} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer mb-5 group">
          <div className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center border transition-colors ${saveCard ? 'bg-primary-blue border-primary-blue' : 'border-gray-300 bg-white'}`}>
            {saveCard && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-[0.813rem] font-medium text-gray-500 group-hover:text-gray-700">Save card for future payments</span>
        </label>

        {/* Buttons */}
        <div className="flex gap-3 mb-5">
          <button 
            onClick={onClose}
            type="button"
            className="flex-[0.8] h-11 border border-gray-300 bg-white rounded-[8px] text-[0.938rem] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-[1.2] h-11 bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : `Pay N${amount}`}
          </button>
        </div>

        <div className="flex-1" />

        {/* Footer */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-gray-500 mb-4">
            <Lock size={12} strokeWidth={2.5} />
            <span className="text-[0.75rem] font-medium">Your payment is secure and encrypted.</span>
          </div>
          <div className="w-full h-px bg-gray-200 mb-3"></div>
          <p className="text-[0.75rem] font-medium text-gray-500 text-center">
            By clicking Pay, you agree to the <a href="#" className="text-primary-blue hover:underline">Terms</a> and Privacy Policy.
          </p>
        </div>

      </div>
    </div>
  );
}
