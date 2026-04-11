import { useState, useEffect, useMemo } from 'react';

// --- MOCK DATA ---

const MOCK_STATS = {
   summary: {
      total: 256,
      active: 24,
      completed: 187,
      canceled: 24
   },
   quickReports: {
      active: 24,
      delivered: 187,
      canceled: 24
   }
};

const MOCK_PAYMENT_METHODS = [
   { id: '1', type: 'wallet', name: 'Procurely Wallet', balance: '₦380,000.00', isDefault: true },
   { id: '2', type: 'bank', name: 'Guaranty Trust Bank', details: '**** 5678', isDefault: false },
   { id: '3', type: 'card', name: 'Mastercard', details: '**** 1234', isDefault: false }
];

// Helper to generate a realistic mock order
const generateMockOrder = (index: number) => {
   const statuses = [
      { status: 'Processing', color: 'orange', category: 'active' },
      { status: 'In Progress', color: 'blue', category: 'active' },
      { status: 'Delivered', color: 'emerald', category: 'completed' },
      { status: 'Canceled', color: 'rose', category: 'canceled' },
   ];
   
   const suppliers = [
      'Traxus Industrial', 'Gibson Holdings', 'Halcyon Supplies', 
      'Primelogic Systems', 'Caltex Resources', 'Genocom Tech', 'Loksand Supplies'
   ];

   const statusObj = statuses[index % statuses.length];
   const supplierName = suppliers[index % suppliers.length];
   const baseAmount = 45000 + (index * 5000) % 150000;

   // Formatter for Naira
   const formatCurrency = (amount: number) => 
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);

   return {
      id: `PRO102${500 + index}`,
      subId: `A85${100 + index}`,
      supplier: supplierName,
      subSup: `${(index % 15) + 1} Items supplied`,
      amount: formatCurrency(baseAmount),
      subAmount: formatCurrency(baseAmount + 15000), // Original price crossed out
      date: `Feb ${((index * 3) % 28) + 1}, 2026`,
      subDate: `Mar ${((index * 5) % 30) + 1}, 2026`,
      status: statusObj.status,
      statusColor: statusObj.color,
      category: statusObj.category,
   };
};

// Generate 233 mock orders realistically
const MOCK_ORDERS = Array.from({ length: 233 }, (_, i) => generateMockOrder(i));


// --- CUSTOM HOOKS ---

export type OrderFilter = 'All' | 'Active' | 'Completed' | 'Canceled';

export function useOrders(filter: OrderFilter = 'All', searchQuery: string = '', page: number = 1, limit: number = 10) {
   const [data, setData] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [totalRecords, setTotalRecords] = useState(0);

   useEffect(() => {
      let isMounted = true;
      setLoading(true);
      setError(null);

      // Simulate network delay
      const delay = Math.floor(Math.random() * 300) + 200; // 200-500ms
      
      const timer = setTimeout(() => {
         if (!isMounted) return;

         try {
            // Apply filtering logic
            let filtered = [...MOCK_ORDERS];

            if (filter !== 'All') {
               filtered = filtered.filter(order => order.category.toLowerCase() === filter.toLowerCase());
            }

            // Apply search logic
            if (searchQuery.trim() !== '') {
               const query = searchQuery.toLowerCase();
               filtered = filtered.filter(
                  order => 
                     order.id.toLowerCase().includes(query) || 
                     order.supplier.toLowerCase().includes(query)
               );
            }

            setTotalRecords(filtered.length);

            // Apply pagination logic
            const startIndex = (page - 1) * limit;
            const paginated = filtered.slice(startIndex, startIndex + limit);

            setData(paginated);
            setLoading(false);
         } catch (err: any) {
            setError(err.message || 'Failed to fetch orders');
            setLoading(false);
         }
      }, delay);

      return () => {
         isMounted = false;
         clearTimeout(timer);
      };
   }, [filter, searchQuery, page, limit]);

   const totalPages = Math.ceil(totalRecords / limit);

   return {
      data,
      loading,
      error,
      pagination: {
         currentPage: page,
         totalPages,
         totalRecords,
         limit,
         startIndex: totalRecords === 0 ? 0 : (page - 1) * limit + 1,
         endIndex: Math.min(page * limit, totalRecords),
      }
   };
}

export function useStats() {
   const [stats, setStats] = useState<{ summary: any, quickReports: any } | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      let isMounted = true;
      
      const delay = Math.floor(Math.random() * 300) + 200;
      const timer = setTimeout(() => {
         if (isMounted) {
            setStats(MOCK_STATS);
            setLoading(false);
         }
      }, delay);

      return () => { isMounted = false; clearTimeout(timer); };
   }, []);

   return { stats, loading, error };
}

export function usePaymentMethods() {
   const [methods, setMethods] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      let isMounted = true;
      
      const delay = Math.floor(Math.random() * 300) + 200;
      const timer = setTimeout(() => {
         if (isMounted) {
            setMethods(MOCK_PAYMENT_METHODS);
            setLoading(false);
         }
      }, delay);

      return () => { isMounted = false; clearTimeout(timer); };
   }, []);

   return { methods, loading, error };
}
