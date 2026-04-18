"use client";

import React, { MouseEvent } from "react";
import { X, Wallet, Copy } from "lucide-react";

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  amount?: string;
}

export function BankTransferModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  amount = "100,000",
}: BankTransferModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("1234567890");
    // Optionally trigger a toast notification here
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative flex flex-col bg-[#FFFFFF] rounded-[16px] w-[400px] h-[574px] p-6 lg:p-7 z-10"
        style={{
          boxShadow: '0px 8px 8px -4px #0000000A, 0px 20px 24px -4px #0000001A'
        }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start mb-4">
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
          <h3 className="text-[1.125rem] font-bold text-gray-900 mb-1.5 tracking-tight">
            Bank Transfer Details
          </h3>
          <p className="text-[0.875rem] text-gray-500 font-medium leading-[1.35] pr-2">
            To fund your wallet, please complete the transfer using the bank details below:
          </p>
        </div>

        {/* Amount Box */}
        <div className="border border-gray-200 rounded-[12px] p-4 pb-4 mb-5">
          <div className="text-[2rem] leading-none font-medium text-[#090C35] tracking-tight mb-2">
            100,000.00
          </div>
          <p className="text-[0.813rem] font-medium text-gray-400">
            You are funding your wallet with N{amount}.
          </p>
        </div>

        {/* Transfer Details Content */}
        <div className="space-y-3 mb-2">
          <h4 className="text-[0.938rem] font-bold text-[#090C35]">
            Bank Transfer Details
          </h4>
          
          <div className="space-y-0.5">
            <p className="text-[0.875rem] font-medium text-gray-500">
              Account Name : Procurely Limited
            </p>
            <p className="text-[0.875rem] font-medium text-gray-500">
              Account Number
            </p>
          </div>

          <div className="flex items-center justify-between h-11 border border-gray-300 rounded-[8px] px-3">
            <span className="font-medium text-gray-800 text-[0.938rem]">123 456 7890</span>
            <button 
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Copy account number"
            >
              <Copy size={16} />
            </button>
          </div>

          <p className="text-[0.875rem] font-bold text-[#090C35] pt-1">
            Bank Name : Gibson Bank
          </p>

          <p className="text-[0.75rem] text-gray-500 font-medium leading-[1.4] pr-2">
            Transfer the exact amount of N{amount} to the account above. 
            Once the transfer is verified, your wallet will be funded.
          </p>
        </div>

        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={onClose}
            type="button"
            className="flex-1 h-11 border border-gray-300 bg-white rounded-[8px] text-[0.938rem] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm()}
            disabled={isLoading}
            className="flex-1 h-11 bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "I have Transferred"}
          </button>
        </div>

      </div>
    </div>
  );
}
