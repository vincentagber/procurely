"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function WishlistClient({ suggestedProducts }: { suggestedProducts: Product[] }) {
  // Empty state by default as requested.
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { addItem, loading } = useCart();

  const handleMoveAllToBag = () => {
    wishlist.forEach(product => void addItem(product.id));
    setWishlist([]); 
  };

  return (
    <div className="container-shell mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Wishlist Section */}
      <div className="mb-24">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#13184f]">Wishlist ({wishlist.length})</h2>
          {wishlist.length > 0 && (
            <button 
              onClick={handleMoveAllToBag}
              disabled={loading}
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-bold text-[#13184f] shadow-sm transition hover:bg-slate-50 hover:shadow-md disabled:opacity-50"
            >
              Move All To Bag
            </button>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlist.map((product, idx) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} index={idx} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-100 bg-white py-32 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
            <div className="mb-8 flex size-28 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
              <Heart className="size-12" />
            </div>
            <h3 className="mb-3 text-3xl font-extrabold text-[#13184f]">Your wishlist is empty</h3>
            <p className="mb-10 text-lg font-medium text-slate-500 max-w-sm text-center">You haven't saved any items to your wishlist yet. Explore our catalog to find materials.</p>
            <Link 
              href="/#explore-products" 
              className="rounded-full bg-[#0b103e] px-10 py-5 text-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-[#13184f] hover:shadow-xl"
            >
              Browse Materials
            </Link>
          </div>
        )}
      </div>

      {/* Just For You Section */}
      <div>
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="h-10 w-4 rounded-full bg-[#ff6f4d]"></span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#13184f] sm:text-4xl">Just For You</h2>
          </div>
          <Link 
            href="/#explore-products"
            className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-bold text-[#13184f] shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
           {suggestedProducts.slice(0, 4).map((product, idx) => (
             <ProductCard key={product.id} product={product} index={idx} />
           ))}
        </div>
      </div>
    </div>
  );
}
