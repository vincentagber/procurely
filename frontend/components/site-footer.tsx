"use client";

import Image from "next/image";
import Link from "next/link";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

import { api } from "@/lib/api";
import type { SiteContent } from "@/lib/types";

type SiteFooterProps = {
  footer: SiteContent["footer"];
  site: SiteContent["site"];
};

export function SiteFooter({ footer, site }: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <footer className="bg-[var(--color-brand-navy)] text-white">
      <div className="container-shell py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr_1fr_1fr_1fr]">
          <div>
            <Image
              alt={site.name}
              className="h-auto w-[133px]"
              height={29}
              src={site.logoLight}
              width={133}
            />
            <p className="mt-6 text-lg font-semibold">{footer.subscribeTitle}</p>
            <p className="mt-4 text-[1.5rem] font-semibold leading-tight sm:text-[1.75rem]">
              {footer.subscribePromo}
            </p>

            <form
              className="mt-6 flex h-12 w-full max-w-[260px] items-center rounded-[12px] border border-white/45 px-4"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  setLoading(true);
                  setError(null);
                  const response = await api.subscribeToNewsletter({ email });
                  setMessage(response.message);
                  setEmail("");
                } catch (nextError) {
                  setError(
                    nextError instanceof Error
                      ? nextError.message
                      : "Unable to subscribe.",
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              <input
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-white/55"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                type="email"
                value={email}
              />
              <button
                aria-label="Subscribe"
                className="text-white/85 transition hover:text-white"
                disabled={loading}
                type="submit"
              >
                <SendHorizontal className="size-5" />
              </button>
            </form>

            {message ? (
              <p className="mt-3 text-sm text-emerald-300">{message}</p>
            ) : null}
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          </div>

          <div>
            <p className="text-lg font-semibold">{site.tagline}</p>
            <div className="mt-6 space-y-3 text-white/80">
              {footer.address.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>{footer.email}</p>
              <p>{footer.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold">Account</p>
            <div className="mt-6 space-y-3 text-white/80">
              {footer.accountLinks.map((link) => (
                <Link className="block transition hover:text-white" href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold">Quick Links</p>
            <div className="mt-6 space-y-3 text-white/80">
              {footer.quickLinks.map((link) => (
                <Link className="block transition hover:text-white" href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold">
              Scan to Connect with us via Whatsapp
            </p>
            <div className="mt-6">
              <Image
                alt="Procurely Whatsapp QR code"
                className="h-auto w-[96px] rounded-[12px] bg-white p-2"
                height={83}
                src={footer.qrImage}
                width={82}
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-6 text-sm text-white/45 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span>Copyright © 2026 {site.name}. All rights reserved</span>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms &amp; Conditions</Link>
          </div>
          <Image
            alt="Accepted payment methods"
            className="h-auto w-full max-w-[330px]"
            height={53}
            src={footer.paymentsImage}
            width={332}
          />
        </div>
      </div>
    </footer>
  );
}
