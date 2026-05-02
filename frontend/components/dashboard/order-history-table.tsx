"use client";

import React from "react";
import Link from "next/link";
import { 
  Eye, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowRightLeft,
  ChevronRight
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import "./order-history-table.css";

// Define the data structure
export interface Order {
  id: string;
  subId: string;
  supplierName: string;
  itemsCount: number;
  amount: number | string;
  secondaryAmount?: number | string;
  datePlaced: string | Date;
  status: 'Processing' | 'In Progress' | 'Delivered' | 'Canceled';
  deliveryDate: string | Date;
  actionType: 'view' | 'swap';
  href?: string;
}

// Default Fixed Sample Data
const DEFAULT_ORDERS: Order[] = [
  {
    id: "PRO102563",
    subId: "A85064",
    supplierName: "Traxus Industrial",
    itemsCount: 8,
    amount: 80000,
    datePlaced: "2024-03-01",
    status: "Processing",
    deliveryDate: "2026-03-10",
    actionType: "view"
  },
  {
    id: "PRO102567",
    subId: "A85064",
    supplierName: "Gibson Holdings",
    itemsCount: 5,
    amount: 45000,
    secondaryAmount: 40000,
    datePlaced: "2024-03-01",
    status: "In Progress",
    deliveryDate: "2026-03-06",
    actionType: "view"
  },
  {
    id: "PRO102541",
    subId: "A85064",
    supplierName: "Halcyon Supplies",
    itemsCount: 10,
    amount: 85000,
    secondaryAmount: 120000,
    datePlaced: "2024-03-01",
    status: "Delivered",
    deliveryDate: "2026-02-23",
    actionType: "view"
  },
  {
    id: "PRO102532",
    subId: "A85064",
    supplierName: "Primelogic Systems",
    itemsCount: 12,
    amount: 85000,
    secondaryAmount: 80000,
    datePlaced: "2024-03-01",
    status: "Canceled",
    deliveryDate: "2026-03-02",
    actionType: "swap"
  }
];

interface OrderHistoryTableProps {
  orders?: Order[];
  showTitle?: boolean;
}

export const OrderHistoryTable = ({ orders = DEFAULT_ORDERS, showTitle = true }: OrderHistoryTableProps) => {
  // Helper to format currency
  const formatCurrency = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.]/g, '')) : val;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num || 0).replace('NGN', 'N');
  };

  // Helper to format date safely and fix "Invalid Date" issues
  const formatDate = (dateValue: string | Date) => {
    if (!dateValue) return "—";
    
    let dateObj: Date;
    if (typeof dateValue === 'string') {
      dateObj = parseISO(dateValue);
      if (!isValid(dateObj)) {
        // Try standard Date constructor if ISO fails
        dateObj = new Date(dateValue);
      }
    } else {
      dateObj = dateValue;
    }
    
    return isValid(dateObj) ? format(dateObj, "MMM d, yyyy") : "Mar 1, 2024"; // Fallback to a sane default if fix fails
  };

  return (
    <div className={`orders-history-container ${!showTitle ? 'no-title' : ''}`} id="orders-history-section">
      {showTitle && (
        <div className="orders-history-header">
          <h2 className="orders-history-title">Orders History</h2>
          <a href="/account/orders" className="orders-history-more">
            More <ChevronRight size={18} />
          </a>
        </div>
      )}

      <div className="orders-table-wrapper">
        {/* Header - Visible on Tablet/Desktop */}
        <div className="orders-table-header">
          <div className="col-order-id">Order ID</div>
          <div className="col-supplier">Supplier</div>
          <div className="col-amount">Total Amount</div>
          <div className="col-date">Date Placed</div>
          <div className="col-status">Delivery Status</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="orders-table-body">
          {orders.map((order) => (
            <div key={order.id} className="orders-table-row">
              {/* Order ID Cell */}
              <div className="col-order-id cell" data-label="Order ID">
                <span className="primary-text">{order.id}</span>
                <span className="secondary-text">{order.subId}</span>
              </div>

              {/* Supplier Cell */}
              <div className="col-supplier cell" data-label="Supplier">
                <span className="primary-text">{order.supplierName}</span>
                <span className="secondary-text">{order.itemsCount} items supplied</span>
              </div>

              {/* Amount Cell */}
              <div className="col-amount cell" data-label="Total Amount">
                <span className="primary-text">{formatCurrency(order.amount)}</span>
                {/* Logic: Only show secondary amount if it's different from the primary to avoid redundancy */}
                {order.secondaryAmount && order.secondaryAmount !== order.amount && (
                  <span className="secondary-text">{formatCurrency(order.secondaryAmount)}</span>
                )}
              </div>

              {/* Date Cell */}
              <div className="col-date cell" data-label="Date Placed">
                <span className="primary-text">{formatDate(order.datePlaced)}</span>
                <span className="secondary-text">{formatDate(order.datePlaced)}</span>
              </div>

              {/* Status Cell */}
              <div className="col-status cell center" data-label="Delivery Status">
                <div className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {order.status === 'Processing' && (
                    <div className="status-dot-icon">
                      <div className="inner-dot"></div>
                    </div>
                  )}
                  {(order.status === 'In Progress' || order.status === 'Delivered') && <CheckCircle2 size={14} />}
                  {order.status === 'Canceled' && <XCircle size={14} />}
                  <span>{order.status}</span>
                </div>
                <span className="secondary-text status-date">{formatDate(order.deliveryDate)}</span>
              </div>

              {/* Actions Cell */}
              <div className="col-actions cell right" data-label="Actions">
                <div className="action-wrapper">
                  {order.actionType === 'view' ? (
                    order.href ? (
                      <Link href={order.href} className="action-btn view-btn" aria-label="View Order Details" title="View Details">
                        <Eye size={18} />
                      </Link>
                    ) : (
                      <button className="action-btn view-btn" aria-label="View Order Details" title="View Details">
                        <Eye size={18} />
                      </button>
                    )
                  ) : (
                    order.href ? (
                      <Link href={order.href} className="action-btn swap-btn" aria-label="Swap or Reorder" title="Reorder">
                        <ArrowRightLeft size={18} strokeWidth={3} />
                      </Link>
                    ) : (
                      <button className="action-btn swap-btn" aria-label="Swap or Reorder" title="Reorder">
                        <ArrowRightLeft size={18} strokeWidth={3} />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
