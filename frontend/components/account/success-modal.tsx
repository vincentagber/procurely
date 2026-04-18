"use client";

import React, { MouseEvent } from "react";
import { X, Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string | React.ReactNode;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  if (!isOpen) return null;

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
        className="relative flex flex-col items-center bg-[#FFFFFF] rounded-[16px] w-[350px] h-[336px] pt-[40px] px-[32px] pb-[32px] border border-gray-100 z-10"
        style={{
          boxShadow: '20px 20px 20px 0px #00000014'
        }}
      >
        {/* Close Button top-right */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Success Icon */}
        <div className="w-[105px] h-[105px] bg-[#C1F6C9] rounded-full flex shrink-0 items-center justify-center mb-5">
          <div className="w-[42px] h-[42px] bg-[#0BB90B] rounded-[10px] flex items-center justify-center shadow-sm">
            <Check size={32} className="text-white" strokeWidth={4} />
          </div>
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center text-center px-1 mb-auto">
          {title && (
            <h3 className="text-[1.125rem] font-bold text-[#090C35] mb-1.5 tracking-tight">
              {title}
            </h3>
          )}
          <p 
            className={
              title 
                ? "text-[0.938rem] font-medium text-gray-500 leading-[1.4]" 
                : "text-[1.063rem] font-medium text-[#090C35] leading-[1.4]"
            }
          >
            {message}
          </p>
        </div>

        {/* Done Button */}
        <button 
          onClick={onClose}
          className="w-[220px] h-[48px] justify-center bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors mt-4"
        >
          Done
        </button>
      </div>
    </div>
  );
}
