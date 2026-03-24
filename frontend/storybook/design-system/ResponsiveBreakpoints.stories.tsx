import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import {
  CodeTag,
  DocsShell,
  PreviewPanel,
  SectionCard,
} from "@/storybook/support/showcase";

const breakpoints = [
  { key: "mobile", label: "Mobile", width: "375px", range: "0px - 767px" },
  { key: "tablet", label: "Tablet", width: "768px", range: "768px - 1023px" },
  { key: "desktop", label: "Desktop", width: "1440px", range: "1024px and up" },
] as const;

type BreakpointKey = (typeof breakpoints)[number]["key"];

const tokenBreakpoints = [
  { name: "xs", width: "375px", usage: "Compact mobile baseline" },
  { name: "sm", width: "480px", usage: "Large mobile / small phablet" },
  { name: "md", width: "768px", usage: "Tablet layout shift" },
  { name: "lg", width: "1024px", usage: "Desktop navigation and 4-column grid" },
  { name: "xl", width: "1280px", usage: "Expanded desktop shell" },
  { name: "2xl", width: "1440px", usage: "Full Procurely marketing width" },
];

const meta = {
  title: "Design System/Responsive Breakpoints",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Procurely switches at the `md` and `lg` thresholds for the most visible layout changes. This interactive story simulates how navigation, hero copy, and product grids adapt as the viewport changes.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutAdaptation: Story = {
  render: () => <ResponsiveBreakpointShowcase />,
};

function ResponsiveBreakpointShowcase() {
  const [active, setActive] = useState<BreakpointKey>("desktop");
  const mode = breakpoints.find((item) => item.key === active) ?? breakpoints[2];

  const productColumns =
    active === "desktop" ? "md:grid-cols-4" : active === "tablet" ? "grid-cols-2" : "grid-cols-1";

  return (
    <DocsShell
      description="Use this story to understand where the layout changes happen and what each breakpoint is expected to do. The simulation below is based on the same Procurely behaviors used in the real homepage."
      eyebrow="Foundation"
      title="Responsive Breakpoints"
    >
      <SectionCard
        description="Switch between breakpoints to inspect the expected layout behavior. This is the same logic engineers should use when verifying responsive implementation against design."
        title="Interactive Layout Preview"
      >
        <div className="flex flex-wrap gap-3">
          {breakpoints.map((breakpoint) => {
            const isActive = breakpoint.key === active;

            return (
              <button
                className={`rounded-button border px-4 py-2 transition-interactive ${
                  isActive
                    ? "border-primary-blue-500 bg-primary-blue-500 text-text-inverse shadow-button"
                    : "border-border-subtle bg-neutral-0 text-text-navy-900 hover:border-primary-blue-300 hover:bg-primary-blue-50"
                }`}
                key={breakpoint.key}
                onClick={() => setActive(breakpoint.key)}
                type="button"
              >
                <span className="block text-sm font-semibold">{breakpoint.label}</span>
                <span className="mt-1 block text-xs opacity-80">{breakpoint.width}</span>
              </button>
            );
          })}
        </div>

        <PreviewPanel className="mt-6">
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <p className="text-caption font-semibold text-secondary-orange-500">
                Active viewport
              </p>
              <h3 className="text-card-title text-text-navy-900">
                {mode.label} ({mode.width})
              </h3>
            </div>
            <CodeTag>{mode.range}</CodeTag>
          </div>

          <div className="mt-6 rounded-card border border-border-subtle bg-white p-5 shadow-card-soft">
            <div className="flex items-center justify-between gap-4 border-b border-border-subtle pb-4">
              <div className="text-product-title text-text-navy-900">Procurely</div>
              {active === "desktop" ? (
                <div className="flex items-center gap-6 text-body-sm font-semibold text-text-navy-700">
                  <span>Home</span>
                  <span>How It Works</span>
                  <span>Buy Materials</span>
                  <span>Blog</span>
                </div>
              ) : active === "tablet" ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-48 rounded-full bg-neutral-100" />
                  <div className="h-10 w-10 rounded-full bg-primary-blue-500" />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-neutral-100" />
              )}
            </div>

            <div className={`mt-6 ${active === "mobile" ? "space-y-5" : "grid gap-6 lg:grid-cols-[1fr_0.9fr]"}`}>
              <div className="space-y-4">
                <p className="text-eyebrow text-secondary-orange-500">Hero adapts first</p>
                <h2
                  className={`font-display leading-[0.92] text-text-navy-900 ${
                    active === "desktop"
                      ? "text-[4rem]"
                      : active === "tablet"
                        ? "text-[3rem]"
                        : "text-[2.2rem]"
                  }`}
                >
                  PROCUREMENT FOR DEVELOPERS. DONE RIGHT
                </h2>
                <p className="max-w-[560px] text-body-sm text-neutral-600">
                  Navigation compresses, hero typography scales down, and product grids
                  collapse from four columns to one.
                </p>
              </div>
              <div className="rounded-card bg-neutral-100 p-5">
                <div className="aspect-[1.2/1] rounded-card-sm bg-[linear-gradient(135deg,#1900FF_0%,#5248FF_100%)]" />
              </div>
            </div>

            <div className={`mt-6 grid gap-4 ${productColumns}`}>
              {Array.from({ length: active === "desktop" ? 4 : active === "tablet" ? 4 : 3 }).map(
                (_, index) => (
                  <div
                    className="rounded-card border border-border-subtle bg-neutral-50 p-4"
                    key={index}
                  >
                    <div className="h-28 rounded-card-sm bg-white" />
                    <div className="mt-4 h-4 w-20 rounded-full bg-neutral-200" />
                    <div className="mt-3 h-5 w-full rounded-full bg-neutral-300" />
                    <div className="mt-2 h-4 w-4/5 rounded-full bg-neutral-200" />
                  </div>
                ),
              )}
            </div>
          </div>
        </PreviewPanel>
      </SectionCard>

      <SectionCard
        description="These are the exact widths defined in the Tailwind theme. `md` and `lg` are the primary Procurely behavior shifts."
        title="Tokenized Viewport Widths"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tokenBreakpoints.map((breakpoint) => (
            <div
              className="rounded-card border border-border-subtle bg-surface-raised p-5 shadow-card-soft"
              key={breakpoint.name}
            >
              <p className="text-product-title text-text-navy-900">{breakpoint.name}</p>
              <p className="mt-1 text-body-sm font-semibold text-primary-blue-500">
                {breakpoint.width}
              </p>
              <p className="mt-3 text-body-sm text-neutral-600">{breakpoint.usage}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </DocsShell>
  );
}
