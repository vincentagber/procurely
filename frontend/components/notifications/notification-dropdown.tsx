"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Clock, CreditCard, ShoppingBag, Wallet, X, CheckSquare } from "lucide-react";
import { useNotifications, Notification } from "./notification-provider";
import { formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, isLoading } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order.paid':
      case 'order.placed':
        return <ShoppingBag className="text-blue-600" size={18} />;
      case 'wallet.funded':
        return <Wallet className="text-emerald-600" size={18} />;
      case 'payment.failed':
        return <CreditCard className="text-red-500" size={18} />;
      default:
        return <Bell className="text-slate-500" size={18} />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'order.paid': return 'bg-blue-50';
      case 'wallet.funded': return 'bg-emerald-50';
      case 'payment.failed': return 'bg-red-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1D4ED8] hover:border-[#1D4ED8] hover:bg-blue-50 transition-all shadow-sm"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5C00] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-blue-900/10 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-[15px] font-black text-[#0A1140]">Notifications</h3>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                {unreadCount === 0 ? 'No new updates' : `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
              </p>
            </div>
            {notifications.length > 0 && (
              <button className="text-[11px] font-black text-[#1D4ED8] hover:underline uppercase tracking-widest">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {isLoading && notifications.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-[12px] font-bold text-slate-400">Loading alerts...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Bell size={32} />
                </div>
                <div>
                  <p className="text-[14px] font-black text-[#0A1140]">All caught up!</p>
                  <p className="text-[12px] font-medium text-slate-400 mt-1">Check back later for updates on your orders and wallet.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 hover:bg-blue-50/30 transition-colors cursor-pointer group relative"
                    onClick={() => markAsRead(item.id)}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl ${getBgColor(item.type)} flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-black text-[#0A1140] truncate">{item.title}</p>
                          <span className="text-[18px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckSquare size={14} />
                          </span>
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={12} />
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
             <button className="text-[12px] font-black text-slate-500 hover:text-[#0A1140] transition-colors uppercase tracking-widest">
                View All Notifications
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
