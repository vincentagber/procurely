"use client";

import React, { useState, FormEvent, MouseEvent } from "react";
import { X, Shield, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  isLoading?: boolean;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    onConfirm({ currentPassword, newPassword });
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
        className="relative flex flex-col bg-[#FFFFFF] rounded-[16px] w-[400px] h-[496px] p-6 lg:p-7 overflow-hidden z-10"
        style={{
          boxShadow: '0px 8px 8px -4px #0000000A, 0px 20px 24px -4px #0000001A'
        }}
      >
        {/* Top bar with absolute X and centered icon */}
        <div className="flex justify-center relative mb-4">
          <div className="w-[52px] h-[52px] bg-[#F9F5FF] rounded-full flex items-center justify-center">
            <Shield size={24} className="text-[#3F2B96]" strokeWidth={2} />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 p-1 -mr-2 -mt-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Titles */}
        <div className="mb-6 text-center">
          <h3 className="text-[1.125rem] font-bold text-gray-900 mb-1.5 tracking-tight">
            Change Password
          </h3>
          <p className="text-[0.875rem] text-gray-500 font-medium leading-[1.3] px-2">
            Enter your password to make this change.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="space-y-4">
            
            {/* Current Password */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">Current Password</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow bg-white">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="flex-1 h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-400 placeholder:tracking-[0.15em] placeholder:text-[1.25rem] placeholder:translate-y-1"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="p-1 text-gray-500 hover:text-gray-700 ml-2"
                >
                  {showCurrent ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">New Password</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow bg-white">
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-400 placeholder:tracking-[0.15em] placeholder:text-[1.25rem] placeholder:translate-y-1"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="p-1 text-gray-500 hover:text-gray-700 ml-2"
                >
                  {showNew ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">Confirm New Password</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow bg-white">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-400 placeholder:tracking-[0.15em] placeholder:text-[1.25rem] placeholder:translate-y-1"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="p-1 text-gray-500 hover:text-gray-700 ml-2"
                >
                  {showConfirm ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>
            </div>

          </div>

          <div className="flex-1" />

          {/* Buttons */}
          <div className="flex gap-3 mb-1 mt-6">
            <button 
              onClick={onClose}
              type="button"
              className="flex-1 h-[46px] border border-gray-300 bg-white rounded-[8px] text-[0.938rem] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
              className="flex-1 h-[46px] bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Update Password"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
