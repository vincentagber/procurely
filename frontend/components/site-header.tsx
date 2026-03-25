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
} from "lucide-react";
import { startTransition, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { useUi } from "@/components/ui/ui-provider";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type SiteHeaderProps = {
  navigation: SiteContent["navigation"];
  site: SiteContent["site"];
};

const socialShortLabels: Record<string, string> = {
  Instagram: "IG",
  Facebook: "FB",
  YouTube: "YT",
  LinkedIn: "IN",
  Pinterest: "PI",
  TikTok: "TT",
};

export function SiteHeader({ navigation, site }: SiteHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, loading } = useCart();
  const { openCart, openQuote } = useUi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const cartCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <header className="border-b border-slate-100">
      <div className="bg-[var(--color-brand-blue)] text-white">
        <div className="container-shell flex items-center justify-between gap-4 py-2 text-xs">
          <div className="flex items-center gap-3">
            {navigation.socialLinks.map((link) => {
              return (
                <a
                  aria-label={link.label}
                  className="inline-flex min-w-5 items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:text-white"
                  href={link.href}
                  key={link.label}
                >
                  {socialShortLabels[link.label] ?? link.label.slice(0, 2)}
                </a>
              );
            })}
          </div>
          <div className="hidden items-center gap-4 md:flex">
            {navigation.accountLinks.map((link) => (
              <Link className="font-medium text-white" href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface-soft)]">
        <div className="container-shell flex flex-wrap items-center gap-4 py-5">
          <Link className="shrink-0" href="/">
            <Image
              alt={site.name}
              height={41}
              priority
              src={site.logoDark}
              width={182}
            />
          </Link>

          <form
            className="order-3 flex h-12 min-w-full items-center rounded-full bg-white px-4 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.05)] lg:order-none lg:min-w-0 lg:flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              const nextQuery = query.trim();
              const href = nextQuery
                ? `/?q=${encodeURIComponent(nextQuery)}#explore-products`
                : "/#explore-products";
              startTransition(() => router.push(href));
            }}
          >
            <input
              className="h-full flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search product..."
              value={query}
            />
            <button
              aria-label="Search materials"
              className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--color-brand-navy)] text-white transition hover:opacity-95"
              type="submit"
            >
              <Search className="size-4" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4">
            <button
              aria-label="Wishlist"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-brand-navy)] transition hover:-translate-y-0.5"
              type="button"
            >
              <Heart className="size-5" />
              <span className="absolute right-1.5 top-1.5 inline-flex size-4 items-center justify-center rounded-full bg-[var(--color-brand-accent)] text-[10px] font-semibold text-white">
                4
              </span>
            </button>
            <Link
              aria-label="Account"
              className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-brand-navy)] transition hover:-translate-y-0.5"
              href="/login"
            >
              <UserRound className="size-5" />
            </Link>
            <button
              aria-label="Open cart"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-brand-navy)] transition hover:-translate-y-0.5"
              onClick={openCart}
              type="button"
            >
              <ShoppingBag className="size-5" />
              <span className="absolute right-1.5 top-1.5 inline-flex size-4 items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-[10px] font-semibold text-white">
                {loading ? "…" : cartCount}
              </span>
            </button>
            <button
              className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[var(--color-brand-blue)] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(25,0,255,0.28)]"
              onClick={openQuote}
              type="button"
            >
              {navigation.submitCta.label}
            </button>
            <button
              className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-brand-navy)] lg:hidden"
              onClick={() => setMenuOpen((current) => !current)}
              type="button"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container-shell py-5">
        <nav
          className={cn(
            "hidden items-center gap-8 text-sm font-semibold text-slate-500 lg:flex",
            menuOpen && "flex flex-col items-start",
          )}
        >
          {navigation.primaryLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                className={cn(
                  "transition hover:text-[var(--color-brand-blue)]",
                  isActive && "text-[var(--color-brand-blue)]",
                )}
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {menuOpen ? (
          <nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-500 lg:hidden">
            {navigation.primaryLinks.map((link) => (
              <Link
                className="transition hover:text-[var(--color-brand-blue)]"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
