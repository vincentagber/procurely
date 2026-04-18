"use client";

import React, { useState, FormEvent, MouseEvent } from "react";
import { X, MapPin } from "lucide-react";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { addressTitle: string; streetAddress: string; city: string; stateRegion: string }) => void;
  isLoading?: boolean;
}

export function AddAddressModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: AddAddressModalProps) {
  const [addressTitle, setAddressTitle] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [stateRegion, setStateRegion] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ addressTitle, streetAddress, city, stateRegion });
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
        className="relative flex flex-col bg-[#FFFFFF] rounded-[16px] w-[400px] h-[592px] p-6 lg:p-7 overflow-hidden z-10"
        style={{
          boxShadow: '0px 8px 8px -4px #0000000A, 0px 20px 24px -4px #0000001A'
        }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-start mb-2">
          <div className="w-[52px] h-[52px] bg-[#F9F5FF] rounded-full flex items-center justify-center">
            <MapPin size={24} className="text-[#3F2B96]" strokeWidth={2} />
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
        <div className="mb-5 text-center">
          <h3 className="text-[1.125rem] font-bold text-gray-900 mb-1.5 tracking-tight">Add New Address</h3>
          <p className="text-[0.875rem] text-gray-500 font-medium leading-[1.3] px-2">
            Please enter your address to proceed with this<br />update.
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="space-y-4">
            
            {/* Address Title */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">Address Tittle</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
                <input 
                  type="text" 
                  value={addressTitle}
                  onChange={(e) => setAddressTitle(e.target.value)}
                  className="w-full h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-500"
                  placeholder="Warehouse"
                />
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">Street Address</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
                <input 
                  type="text" 
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-500"
                  placeholder="42, Adebayo Street"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">City</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-500"
                  placeholder="Apapa"
                />
              </div>
            </div>

            {/* State / Region */}
            <div>
              <label className="block text-[0.813rem] font-bold text-[#374151] mb-1.5">State / Region</label>
              <div className="flex items-center h-11 border border-gray-300 rounded-[8px] px-3 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-shadow">
                <input 
                  type="text" 
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  className="w-full h-full outline-none bg-transparent font-medium text-gray-900 text-[0.938rem] placeholder:text-gray-500"
                  placeholder="Lagos Mainland"
                />
              </div>
            </div>

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
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 bg-[#090C35] text-white rounded-[8px] text-[0.938rem] font-bold hover:bg-[#070a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
