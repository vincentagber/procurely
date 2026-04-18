"use client";

import React, { useState, MouseEvent, KeyboardEvent } from "react";
import { X, Lock } from "lucide-react";

interface AuthenticatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: (code: string) => void;
  isLoading?: boolean;
}

export function AuthenticatorModal({
  isOpen,
  onClose,
  onEnable,
  isLoading = false,
}: AuthenticatorModalProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    if (value && !/^[A-Za-z0-9]$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`auth-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`auth-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = () => {
    onEnable(code.join(""));
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px] transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative flex flex-col bg-[#FFFFFF] rounded-[14.15px] w-[453px] h-[515px] p-6 lg:p-7 overflow-hidden z-10"
        style={{
          boxShadow: '0px 7.08px 7.08px -3.54px #0000000A, 0px 17.69px 21.23px -3.54px #0000001A'
        }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-[42px] h-[42px] border border-gray-200 rounded-[8px] flex items-center justify-center">
            <Lock size={20} className="text-gray-800" strokeWidth={2} />
          </div>
          <button 
            onClick={onClose}
            className="p-1 -mr-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Titles */}
        <div className="mb-4">
          <h3 className="text-[1.063rem] font-bold text-gray-900 mb-1 tracking-tight">
            Set up two-factor authentication
          </h3>
          <p className="text-[0.813rem] text-gray-600 font-medium leading-[1.4] pr-2">
            To authorise transactions, please scan this QR code with your Google Authenticator App and enter the verification code below.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="w-full flex justify-center items-center bg-[#F9FAFB] rounded-[10px] py-4 mb-4 border border-gray-50/50">
          <div className="bg-white p-1 rounded border border-gray-100 flex items-center justify-center shadow-sm">
            {/* SVG placeholder mocking a QR code layout closely */}
            <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor" className="text-black">
              {/* Outer markers */}
              <path fillRule="evenodd" clipRule="evenodd" d="M0 0h28v28H0V0zm4 4v20h20V4H4zm4 4h12v12H8V8z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M72 0h28v28H72V0zm4 4v20h20V4H76zm4 4h12v12H80V8z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M0 72h28v28H0V72zm4 4v20h20V76H4zm4 4h12v12H8V80z" />
              {/* Random block pattern generator logic in CSS SVG */}
              <rect x="32" y="0" width="8" height="8" />
              <rect x="44" y="0" width="8" height="12" />
              <rect x="56" y="8" width="12" height="8" />
              <rect x="36" y="16" width="12" height="8" />
              <rect x="52" y="24" width="8" height="8" />
              <rect x="64" y="20" width="8" height="16" />
              <rect x="32" y="32" width="28" height="8" />
              <rect x="64" y="40" width="16" height="8" />
              <rect x="84" y="32" width="8" height="20" />
              <rect x="76" y="56" width="12" height="16" />
              <rect x="92" y="60" width="8" height="8" />
              <rect x="76" y="80" width="8" height="8" />
              <rect x="88" y="76" width="8" height="12" />
              <rect x="72" y="92" width="28" height="8" />
              <rect x="32" y="44" width="12" height="8" />
              <rect x="48" y="48" width="8" height="16" />
              <rect x="20" y="36" width="8" height="16" />
              <rect x="0" y="32" width="12" height="8" />
              <rect x="8" y="44" width="8" height="8" />
              <rect x="0" y="52" width="16" height="12" />
              <rect x="24" y="60" width="8" height="8" />
              <rect x="36" y="60" width="20" height="8" />
              <rect x="44" y="72" width="8" height="12" />
              <rect x="32" y="84" width="16" height="8" />
              <rect x="52" y="88" width="8" height="12" />
              <rect x="60" y="76" width="8" height="8" />
            </svg>
          </div>
        </div>

        {/* Pin Input section */}
        <div className="mb-2">
          <label className="block text-[0.813rem] font-bold text-[#374151] mb-2">Verification code</label>
          <div className="flex items-center justify-between w-full">
            {code.map((val, i) => (
              <React.Fragment key={i}>
                {i === 3 && <div className="text-gray-300 font-extrabold mx-1.5 text-2xl">-</div>}
                <input 
                  id={`auth-input-${i}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-[45px] h-[58px] text-center text-[2rem] text-gray-800 font-medium border border-[#E5E7EB] rounded-[8px] focus:outline-none focus:border-gray-400 placeholder:text-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                  placeholder="0"
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Retry Context */}
        <p className="text-[0.813rem] font-medium text-gray-600 mb-1 mt-1">
          Didn't get a code?{" "}
          <button className="text-[#EF4444] hover:underline underline-offset-2">Try again.</button>{" "}
          <span className="text-[#3B82F6] font-bold">33s</span>
        </p>

        <div className="flex-1" />

        {/* Buttons */}
        <div className="flex gap-3 mb-2 mt-4">
          <button 
            onClick={onClose}
            type="button"
            className="flex-1 h-11 border border-gray-300 bg-white rounded-[8px] text-[0.938rem] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading || code.some(c => !c)}
            className="flex-[1.2] h-11 bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Enable Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
