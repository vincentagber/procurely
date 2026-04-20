"use client";

import React from "react";
import Link from "next/link";
import { 
  FileUp, 
  PlusCircle, 
  UserPlus, 
  FileText, 
  ChevronRight,
  FileCode,
  ShoppingBag,
  User,
  AlertCircle,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/format";

/**
 * Interface for individual tool or document items
 */
export interface DashboardItem {
  id: string | number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
  href?: string;
  value?: string | number;
}

/**
 * Props for the Unified Dashboard Tools component
 */
interface DashboardToolsProps {
  activityStats?: { label: string; val: string | number; icon: React.ReactNode; color: string; bg: string }[];
  quickTools?: DashboardItem[];
  recentDocuments?: DashboardItem[];
  className?: string;
}

/**
 * Unified component combining Activity Summary, Quick Tools, and Recent Documents into a single vertical block.
 * Adheres to the "Sovereign Clean" design system with flat, clean items (no internal shadows or radii).
 */
export function DashboardTools({ 
  activityStats,
  quickTools, 
  recentDocuments,
  className 
}: DashboardToolsProps) {
  
  // Default data for Activity Summary
  const stats = activityStats || [
    { label: "Requests created", val: "142", icon: <LayoutDashboard size={14} />, color: "text-[#FF5C00]", bg: "bg-orange-50" },
    { label: "Orders delivered", val: "95", icon: <ShoppingBag size={14} />, color: "text-[#1D4ED8]", bg: "bg-blue-50" },
    { label: "Suppliers engaged", val: "37", icon: <User size={14} />, color: "text-blue-400", bg: "bg-sky-50" },
    { label: "Deliveries in progress", val: "4", icon: <AlertCircle size={14} />, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  // Default data for Quick Tools
  const tools = quickTools || [
    {
      id: "upload-boq",
      title: "Upload BoQ Document",
      subtitle: "12 MB",
      icon: <FileUp size={16} className="text-blue-600" />,
      iconBg: "bg-blue-50",
      href: "/account/boq/upload"
    },
    {
      id: "create-rfq",
      title: "Created New RFQ",
      subtitle: "2 MB",
      icon: <PlusCircle size={16} className="text-[#13184F]" />,
      iconBg: "bg-slate-100",
      href: "/account/rfq/new"
    },
    {
      id: "add-supplier",
      title: "Add New Supplier",
      subtitle: "22 KB",
      icon: <UserPlus size={16} className="text-emerald-600" />,
      iconBg: "bg-emerald-50",
      href: "/account/suppliers/add"
    }
  ];

  // Default data for Recent Documents
  const docs = recentDocuments || [
    {
      id: "boq-material",
      title: "BoQ: Updated.xlx",
      subtitle: "23 MB",
      icon: <FileText size={16} className="text-orange-500" />,
      iconBg: "bg-orange-50",
      href: "/account/documents/boq-material"
    },
    {
      id: "invoice-056",
      title: "Invoice: 054 pdf",
      subtitle: "26 MB",
      icon: <FileCode size={16} className="text-rose-500" />,
      iconBg: "bg-rose-50",
      href: "/account/documents/invoice-056"
    }
  ];

  return (
    <div 
      className={cn(
        "bg-white rounded-[32px] overflow-hidden flex flex-col",
        className
      )}
      style={{ 
        width: "229.97px", 
        padding: "7.74px",
        gap: "7.74px"
      }}
    >
      {/* Activity Summary Section */}
      <div className="flex flex-col mb-4" style={{ gap: "4px" }}>
        <h3 className="px-3 py-2 text-[13px] font-black text-[#13184F]">Activity Summary</h3>
        <div className="flex flex-col">
          {stats.map((item) => (
            <div key={item.label} className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-slate-50 group">
                <div className="flex items-center gap-3">
                   <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", item.bg, item.color)}>
                      {item.icon}
                   </div>
                   <span className="text-[10px] font-bold text-slate-500">{item.label}</span>
                </div>
                <span className="text-[11px] font-black text-[#13184F]">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools Section */}
      <div className="flex flex-col mb-4" style={{ gap: "4px" }}>
        <h3 className="px-3 py-2 text-[13px] font-black text-[#13184F]">Quick Tools</h3>
        <div className="flex flex-col">
          {tools.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="flex flex-col pb-4" style={{ gap: "4px" }}>
        <div className="flex items-center justify-between px-3 py-2">
          <h3 className="text-[13px] font-black text-[#13184F]">Recent Documents</h3>
          <Link href="/account/documents" className="text-[10px] font-black text-[#FF5C00] hover:underline uppercase tracking-wider">
            View All
          </Link>
        </div>
        <div className="flex flex-col">
          {docs.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Internal Row Component for Dashboard Items (Flat style)
 */
function ItemRow({ item }: { item: DashboardItem }) {
  const Content = (
    <div className="flex items-center justify-between w-full px-3 py-2.5 transition-all group cursor-pointer hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner", item.iconBg)}>
          {item.icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-black text-[#13184F] truncate leading-tight group-hover:text-[#FF5C00] transition-colors">{item.title}</span>
          <span className="text-[9px] font-bold text-slate-400 mt-0.5 leading-none">{item.subtitle}</span>
        </div>
      </div>
      <div className="text-slate-200 group-hover:text-[#13184F] transition-all">
        <ChevronRight size={14} strokeWidth={2.5} />
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block w-full">
        {Content}
      </Link>
    );
  }

  return (
    <button onClick={item.onClick} className="block w-full text-left">
      {Content}
    </button>
  );
}
