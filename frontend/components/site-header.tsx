"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { startTransition, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useCart } from "@/components/cart/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useUi } from "@/components/ui/ui-provider";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type SiteHeaderProps = {
  navigation: SiteContent["navigation"];
  site: SiteContent["site"];
};

export function SiteHeader({ navigation, site }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { openCart } = useUi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const cartCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  
  const wishlistCount = wishlist?.items.length ?? 0;

  return (
    <header className="w-full">
      {/* Top Bar - Dark Blue */}
      <div className="bg-[#00008b] text-white">
        <div className="container-shell mx-auto flex h-[42px] items-center justify-between px-4">
          <div className="flex items-center gap-5">
             <InstagramIcon className="size-[15px] opacity-90 transition hover:opacity-100" />
             <FacebookIcon className="size-[15px] opacity-90 transition hover:opacity-100" />
             <LinkedinIcon className="size-[15px] opacity-90 transition hover:opacity-100" />
             <YoutubeIcon />
             <PinterestIcon />
             <TikTokIcon />
          </div>
          <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-wider">
            <UserRound className="size-4" strokeWidth={2.5} />
            <Link href="/login" className="hover:text-white/80">Login / Register</Link>
          </div>
        </div>
      </div>

      {/* Middle Bar - Light Grayish */}
      <div className="bg-[#ebedf5] py-4">
        <div className="container-shell mx-auto flex items-center justify-between px-4">
          <Link href="/" className="shrink-0">
            <Image
              alt={site.name}
              height={32}
              priority
              src={site.logoDark}
              width={140}
              className="h-auto w-[160px] object-contain"
            />
          </Link>

          <form
            className="hidden lg:flex relative h-[52px] w-full max-w-[620px] items-center overflow-hidden rounded-full bg-white shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              const nextQuery = query.trim();
              const href = nextQuery
                ? `/materials?q=${encodeURIComponent(nextQuery)}`
                : "/materials";
              startTransition(() => router.push(href));
            }}
          >
            <input
              className="h-full w-full bg-transparent px-8 text-[15px] text-slate-800 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product..."
              value={query}
            />
            <button
              aria-label="Search"
              className="absolute right-0 top-0 flex h-full w-[64px] items-center justify-center bg-[#0b103e] text-white transition hover:bg-[#13184f]"
              type="submit"
            >
              <Search className="size-5" />
            </button>
          </form>

          <div className="flex items-center gap-6">
            <Link href="/wishlist" className="relative p-1 text-[#13184f] transition hover:scale-105">
              <Heart className="size-7" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1.5 -top-1 flex size-5 items-center justify-center rounded-full bg-[#ef5350] text-[10px] font-black text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/account" className="p-1 text-[#13184f] transition hover:scale-105">
               <UserRound className="size-7" strokeWidth={1.5} />
            </Link>
            <button onClick={openCart} className="relative p-1 text-[#13184f] transition hover:scale-105">
              <ShoppingBag className="size-7" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1 flex size-5 items-center justify-center rounded-full bg-[#1900ff] text-[10px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
               <Menu className="size-7 text-[#13184f]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar - White */}
      <div className="bg-white py-4 shadow-sm">
        <div className="container-shell mx-auto flex items-center justify-between px-4">
          <nav className="hidden items-center gap-10 text-[15.5px] font-bold text-[#13184f] lg:flex">
             {navigation.primaryLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    className={cn("transition hover:text-[#1900ff]", isActive && "text-[#1900ff]")}
                  >
                    {link.label}
                  </Link>
                );
             })}
          </nav>

          <Link 
            href="/contact-quote" 
            className="flex h-[56px] min-w-[200px] items-center justify-center rounded-[12px] bg-[#1900ff] px-10 text-[15.5px] font-black text-white shadow-lg shadow-indigo-500/10 transition active:scale-[0.98]"
          >
            Submit BOQ / Contact
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-overlay bg-slate-950/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 top-0 z-drawer w-[280px] bg-white p-8 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                 <p className="text-xl font-black text-[#13184f]">Menu</p>
                 <button onClick={() => setMenuOpen(false)}>
                    <X className="size-6 text-slate-400" />
                 </button>
              </div>
              <nav className="flex flex-col gap-6 font-bold text-[#13184f]">
                 {navigation.primaryLinks.map((link) => (
                    <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                       {link.label}
                    </Link>
                 ))}
                 <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-6">
                    {navigation.accountLinks.map((link) => (
                      <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                        {link.label}
                      </Link>
                    ))}
                 </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function PinterestIcon() {
  return (
    <svg className="size-[15px] fill-white" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <path d="M128 0C57.312 0 0 57.312 0 128c0 54.144 33.6 100.416 81.184 119.296-.288-9.408-.032-20.704 2.144-30.016 2.368-10.112 15.68-66.432 15.68-66.432s-3.872-7.744-3.872-19.2c0-18.016 10.432-31.456 23.424-31.456 11.04 0 16.384 8.288 16.384 18.24 0 11.104-7.072 27.68-10.72 43.072-3.04 12.832 6.432 23.328 19.072 23.328 22.912 0 38.336-29.376 38.336-64.16 0-26.496-17.824-46.4-50.56-46.4-37.216 0-60.672 27.776-60.672 58.976 0 10.72 3.168 18.272 8.16 24.16 2.272 2.72 2.592 3.808 1.76 7.04-.576 2.272-1.888 7.552-2.464 9.728-.768 3.104-3.168 4.224-5.824 3.136-16.128-6.912-23.616-25.408-23.616-46.176 0-34.368 28.928-75.136 86.848-75.136 46.56 0 77.248 33.728 77.248 70.048 0 47.936-26.656 83.712-66.08 83.712-13.184 0-25.568-7.168-29.824-15.264 0 0-7.104 28.416-8.544 33.792-2.528 9.504-7.488 18.944-11.968 25.888 11.776 3.488 24.192 5.376 37.056 5.376 70.688 0 128-57.312 128-128S198.688 0 128 0z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="size-[15px] fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.536 6.57c0-2.01 0-4.516 0-4.516h4.123c.033 2.303 1.258 4.322 3.085 5.45V11.5c-1.747-.025-3.348-.598-4.626-1.543v6.786c0 3.102-2.512 5.618-5.618 5.618-3.102 0-5.618-2.516-5.618-5.618 0-3.102 2.516-5.618 5.618-5.618.375 0 .733.037 1.08.106v3.297c-.35-.069-.71-.106-1.08-.106-1.341 0-2.43 1.089-2.43 2.43s1.089 2.43 2.43 2.43c1.341 0 2.43-1.089 2.43-2.43V6.57h2.618z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="size-[15px] fill-white opacity-90 transition hover:opacity-100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
