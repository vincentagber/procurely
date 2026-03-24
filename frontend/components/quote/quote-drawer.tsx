"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

import { TextAreaField, TextField } from "@/components/forms/form-field";
import { useUi } from "@/components/ui/ui-provider";
import { api } from "@/lib/api";

export function QuoteDrawer() {
  const { quoteOpen, closeQuote } = useUi();
  const [form, setForm] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    projectLocation: "",
    boqNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {quoteOpen ? (
        <>
          <motion.button
            aria-label="Close quote request"
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuote}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-white px-5 pb-6 pt-5 shadow-2xl md:px-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">
                  BOQ / Contact
                </p>
                <h2 className="text-2xl font-semibold text-[var(--color-brand-navy)]">
                  Submit your project request
                </h2>
              </div>
              <button
                className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                onClick={closeQuote}
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-500">
              Share your company, project scope, and BOQ notes. Procurely will
              respond with matched materials, phased delivery options, and pricing.
            </p>

            {message ? (
              <div className="mt-5 rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mt-5 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form
              className="mt-6 space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                try {
                  setLoading(true);
                  setMessage(null);
                  setError(null);
                  const response = await api.requestQuote(form);
                  setMessage(response.message);
                  setForm({
                    companyName: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    projectLocation: "",
                    boqNotes: "",
                  });
                } catch (nextError) {
                  setError(
                    nextError instanceof Error
                      ? nextError.message
                      : "Unable to submit quote request.",
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Company"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      companyName: event.target.value,
                    }))
                  }
                  placeholder="Procurely Homes Ltd"
                  required
                  value={form.companyName}
                />
                <TextField
                  label="Full name"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Ada Okafor"
                  required
                  value={form.fullName}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Email"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="team@procurely.com"
                  required
                  type="email"
                  value={form.email}
                />
                <TextField
                  label="Phone"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="+234 800 000 0000"
                  required
                  value={form.phone}
                />
              </div>
              <TextField
                label="Project location"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    projectLocation: event.target.value,
                  }))
                }
                placeholder="Ikoyi, Lagos"
                required
                value={form.projectLocation}
              />
              <TextAreaField
                label="BOQ notes"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    boqNotes: event.target.value,
                  }))
                }
                placeholder="List the materials, quantities, milestones, or any special requirements."
                required
                value={form.boqNotes}
              />
              <button
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(25,0,255,0.28)] disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "Submitting..." : "Submit BOQ / Contact"}
              </button>
            </form>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
