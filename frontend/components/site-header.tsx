"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, CircleUser, X } from "lucide-react";
import { startTransition, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useUi } from "@/components/ui/ui-provider";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type SiteHeaderProps = {
  navigation: SiteContent["navigation"];
  site: SiteContent["site"];
};

const headerShellClassName =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-8 xl:px-10";

export function SiteHeader({ navigation, site }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openCart, openQuote } = useUi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <header className="relative z-header bg-surface-canvas">
      <div className="bg-primary-blue text-text-inverse">
        <div
          className={cn(
            headerShellClassName,
            "flex min-h-[44px] items-center justify-between gap-4",
          )}
        >
          <div className="flex items-center gap-3 text-white/95 sm:gap-3.5">
            {navigation.socialLinks.map((link) => (
              <a
                aria-label={link.label}
                className="inline-flex size-3.5 items-center justify-center transition-interactive hover:text-white/70"
                href={link.href}
                key={link.label}
              >
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2 text-sm font-semibold text-text-inverse md:flex">
            <CircleUser className="size-4 stroke-[1.9]" />
            {navigation.accountLinks.map((link) => (
              <Link
                className="transition-interactive hover:text-white/80"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#f3f4fa]">
        <div
          className={cn(
            headerShellClassName,
            "grid grid-cols-2 lg:grid-cols-[auto_minmax(420px,680px)_auto] min-h-[80px] items-center gap-y-4 gap-x-2 py-4 sm:gap-5 lg:min-h-[92px]",
          )}
        >
          <Link className="shrink-0" href="/">
            <Image
              alt={site.name}
              className="h-auto w-[148px] object-contain sm:w-[156px] lg:w-[164px]"
              height={29}
              priority
              src={site.logoDark}
              width={133}
            />
          </Link>

          <form
            className="order-3 col-span-2 lg:col-span-1 lg:order-none flex h-[46px] w-full overflow-hidden rounded-full bg-surface-raised shadow-field lg:order-none"
            onSubmit={(event) => {
              event.preventDefault();
              const nextQuery = query.trim();
              const href = nextQuery
                ? `/materials?q=${encodeURIComponent(nextQuery)}`
                : "/materials";
              startTransition(() => {
                 router.push(href);
              });
            }}
          >
            <input
              aria-label="Search product"
              className="h-full min-w-0 flex-1 bg-transparent px-8 text-[15px] text-text-navy-900 outline-none placeholder:text-neutral-500"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product..."
              value={query}
            />
            <button
              aria-label="Search materials"
              className="inline-flex h-full w-[66px] shrink-0 items-center justify-center rounded-full rounded-l-none bg-primary-navy text-text-inverse transition-interactive hover:bg-primary-navy-600"
              type="submit"
            >
              <Search className="size-5 stroke-[2.1]" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 text-primary-navy sm:gap-5 lg:gap-7">
            <Link
              aria-label="Wishlist"
              className="relative inline-flex items-center justify-center text-primary-navy transition-interactive hover:text-primary-blue-500"
              href="/wishlist"
            >
              <Heart className="size-[30px] stroke-[1.85]" />
              <span className="absolute -right-1.5 top-0 inline-flex size-5 items-center justify-center rounded-full bg-[#ef5350] text-[11px] font-bold leading-none text-white">
                0
              </span>
            </Link>

            <Link
              aria-label="Account"
              className="inline-flex items-center justify-center text-primary-navy transition-interactive hover:text-primary-blue-500"
              href={
                typeof window !== "undefined" &&
                window.localStorage.getItem("procurely-auth-token")
                  ? "/account"
                  : "/login"
              }
            >
              <CircleUser className="size-[30px] stroke-[1.85]" />
            </Link>

            <button
              aria-label="Open cart"
              className="inline-flex items-center justify-center text-primary-navy transition-interactive hover:text-primary-blue-500"
              onClick={openCart}
              type="button"
            >
              <ShoppingBag className="size-[29px] stroke-[1.85]" />
            </button>

            <button
              aria-label="Toggle navigation"
              className="inline-flex items-center justify-center text-primary-navy lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <Menu className="size-7 stroke-[1.9]" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface-canvas">
        <div
          className={cn(
            headerShellClassName,
            "flex min-h-[74px] items-center justify-between gap-6 py-3 sm:min-h-[82px] sm:gap-8 lg:min-h-[88px]",
          )}
        >
          <nav className="hidden items-center gap-8 lg:flex xl:gap-12">
            {navigation.primaryLinks.map((link) => {
              const href = link.href.startsWith("#") ? `/${link.href}` : link.href;
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);

              return (
                <Link
                  className={cn(
                    "text-[15px] font-semibold leading-none text-primary-navy transition-interactive hover:text-primary-blue-500 xl:text-[17px] relative",
                    isActive && "text-primary-blue-500",
                  )}
                  href={href}
                  key={link.label}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-primary-blue-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <Link
            className="hidden min-w-[264px] h-[60px] items-center justify-center rounded-[14px] bg-primary-blue px-8 text-[17px] font-semibold text-text-inverse shadow-button transition-interactive hover:bg-primary-blue-600 lg:inline-flex"
            href={navigation.submitCta.href}
          >
            {navigation.submitCta.label}
          </Link>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm lg:hidden"
              />
              
              {/* Slide-out Drawer */}
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 z-[110] w-[85%] max-w-[320px] bg-white shadow-2xl lg:hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-6 border-b border-slate-50">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1900ff] mb-0.5">Menu</span>
                      <p className="text-xl font-black text-[#13184f] tracking-tight">Procurely™</p>
                   </div>
                   <button 
                    onClick={() => setMenuOpen(false)}
                    className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#13184f] transition"
                   >
                     <X className="size-6" />
                   </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="space-y-6">
                    {navigation.primaryLinks.map((link) => {
                      const href = link.href.startsWith("#") ? `/${link.href}` : link.href;
                      const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

                      return (
                        <Link
                          key={link.label}
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between group py-2",
                            isActive ? "text-[#1900ff]" : "text-[#13184f]"
                          )}
                        >
                          <span className="text-lg font-bold tracking-tight">{link.label}</span>
                          <div className={cn(
                            "size-2 rounded-full transition-all duration-300",
                            isActive ? "bg-[#1900ff] scale-100" : "bg-slate-200 scale-50 group-hover:scale-100"
                          )} />
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-12 pt-10 border-t border-slate-50 space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account & Identity</p>
                    <div className="grid grid-cols-1 gap-4">
                       {navigation.accountLinks.map((link) => (
                         <Link
                           key={link.label}
                           href={link.href}
                           onClick={() => setMenuOpen(false)}
                           className="flex items-center gap-4 p-4 rounded-2xl bg-[#f6f7fd] border border-[#f0f1fa] text-[#13184f] hover:bg-[#1900ff] hover:text-white transition group"
                         >
                           <CircleUser className="size-5" />
                           <span className="font-bold text-sm">{link.label}</span>
                         </Link>
                       ))}
                    </div>
                  </div>
                </nav>

                <div className="p-6 border-t border-slate-50">
                  <Link
                    className="flex h-[60px] w-full items-center justify-center rounded-[18px] bg-[#13184f] text-[15px] font-bold text-white shadow-lg shadow-indigo-500/10 transition active:scale-[0.98]"
                    href={navigation.submitCta.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {navigation.submitCta.label}
                  </Link>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "Instagram":
      return (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4.25"
            y="4.25"
            width="15.5"
            height="15.5"
            rx="4.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" />
        </svg>
      );
    case "Facebook":
      return (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.08 8.32h2.26V4.5c-.39-.05-1.73-.17-3.33-.17-3.3 0-5.56 2.02-5.56 5.74v3.21H4v4.27h3.45v5.95h4.22v-5.95h3.3l.52-4.27h-3.82v-2.78c0-1.23.34-2.07 2.41-2.07Z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.58 8.18a2.98 2.98 0 0 0-2.1-2.11C17.62 5.56 12 5.56 12 5.56s-5.62 0-7.48.5A2.98 2.98 0 0 0 2.42 8.18C1.91 10.04 1.91 12 1.91 12s0 1.96.51 3.82a2.98 2.98 0 0 0 2.1 2.11c1.86.5 7.48.5 7.48.5s5.62 0 7.48-.5a2.98 2.98 0 0 0 2.1-2.11c.51-1.86.51-3.82.51-3.82s0-1.96-.51-3.82ZM10.18 15.66V8.34L16.5 12l-6.32 3.66Z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.45 8.33a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88ZM4.78 9.77h3.34v9.98H4.78V9.77Zm5.44 0h3.2v1.36h.04c.45-.85 1.53-1.75 3.16-1.75 3.38 0 4 2.22 4 5.1v5.27h-3.34V15.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73h-3.34V9.77Z" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 3.38c-4.84 0-7.3 3.47-7.3 6.36 0 1.75.66 3.31 2.08 3.89.23.1.43 0 .5-.25.05-.17.15-.6.2-.79.07-.25.04-.33-.15-.55-.42-.49-.69-1.13-.69-2.03 0-2.62 1.96-4.97 5.1-4.97 2.79 0 4.32 1.7 4.32 3.97 0 2.99-1.32 5.52-3.28 5.52-1.08 0-1.89-.89-1.63-1.98.31-1.3.9-2.7.9-3.64 0-.84-.45-1.54-1.38-1.54-1.09 0-1.97 1.13-1.97 2.64 0 .96.32 1.61.32 1.61l-1.3 5.5c-.38 1.6-.06 3.57-.03 3.77.02.12.17.15.24.06.1-.13 1.35-1.67 1.77-3.2.12-.43.66-2.57.66-2.57.33.64 1.3 1.2 2.33 1.2 3.06 0 5.14-2.79 5.14-6.53 0-2.82-2.39-5.45-6.04-5.45Z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg
          aria-hidden="true"
          className="size-3.5"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.62 3.5c.24 1.94 1.37 3.74 3.17 4.73a6.3 6.3 0 0 0 2.22.74v3.01a9.5 9.5 0 0 1-3.1-.64 8.54 8.54 0 0 1-1.89-1.04v6.2a5.95 5.95 0 1 1-5.95-5.95c.34 0 .67.03 1 .09v3.1a2.88 2.88 0 1 0 1.87 2.76V3.5h2.68Z" />
        </svg>
      );
    default:
      return (
        <span className="text-[11px] font-semibold">{label.slice(0, 1)}</span>
      );
  }
}
