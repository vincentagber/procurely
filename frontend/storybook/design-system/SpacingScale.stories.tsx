import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import {
  CodeTag,
  DetailStack,
  DocsShell,
  PreviewPanel,
  SectionCard,
} from "@/storybook/support/showcase";

const spacingTokens = [
  {
    token: "1",
    pixels: 4,
    tailwind: ["gap-1", "p-1", "space-y-1"],
    usage: "Icon alignment, divider breathing room, and micro nudges.",
  },
  {
    token: "2",
    pixels: 8,
    tailwind: ["gap-2", "p-2", "space-y-2"],
    usage: "Form label-to-input spacing and compact inline groups.",
  },
  {
    token: "4",
    pixels: 16,
    tailwind: ["gap-4", "p-4", "space-y-4"],
    usage: "Default card rhythm, content stacks, and mobile gutters.",
  },
  {
    token: "6",
    pixels: 24,
    tailwind: ["gap-6", "p-6", "space-y-6", "p-card"],
    usage: "Product cards, drawers, and multi-block content groups.",
  },
  {
    token: "8",
    pixels: 32,
    tailwind: ["gap-8", "p-8", "space-y-8", "p-panel"],
    usage: "Panels, feature blocks, and desktop content groupings.",
  },
  {
    token: "12",
    pixels: 48,
    tailwind: ["gap-12", "py-12"],
    usage: "Section spacing on tablet and banner composition gaps.",
  },
  {
    token: "16",
    pixels: 64,
    tailwind: ["gap-16", "py-section"],
    usage: "Desktop section rhythm and large canvas separation.",
  },
];

const meta = {
  title: "Design System/Spacing Scale",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Procurely uses a 4px-based scale with semantic extensions like `p-card`, `p-panel`, and `py-section`. The examples below show both the raw scale and how it compounds inside actual layouts.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractiveRhythm: Story = {
  render: () => <SpacingScaleShowcase />,
};

function SpacingScaleShowcase() {
  const [selected, setSelected] = useState(spacingTokens[3]);

  return (
    <DocsShell
      description="Select any spacing token to inspect how it affects card padding, stack gaps, and layout rhythm. This is the reference used to keep Procurely sections, cards, and forms visually consistent."
      eyebrow="Foundation"
      title="Spacing Scale"
    >
      <SectionCard
        description="Use the core scale for primitive spacing, then switch to semantic tokens like `p-card` and `py-section` when the layout intent matters more than the raw value."
        title="Interactive Token Preview"
      >
        <div className="flex flex-wrap gap-3">
          {spacingTokens.map((token) => {
            const active = selected.token === token.token;

            return (
              <button
                className={`rounded-button border px-4 py-2 text-left transition-interactive ${
                  active
                    ? "border-primary-blue-500 bg-primary-blue-500 text-text-inverse shadow-button"
                    : "border-border-subtle bg-neutral-0 text-text-navy-900 hover:border-primary-blue-300 hover:bg-primary-blue-50"
                }`}
                key={token.token}
                onClick={() => setSelected(token)}
                type="button"
              >
                <span className="block text-sm font-semibold">{token.pixels}px</span>
                <span className="mt-1 block text-xs opacity-80">Token {token.token}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PreviewPanel>
            <div
              className="rounded-card border border-border-subtle bg-white shadow-card-soft"
              style={{ padding: `${selected.pixels}px` }}
            >
              <div
                className="flex flex-col"
                style={{ gap: `${selected.pixels}px` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-caption text-secondary-orange-500">Procurely Card</p>
                    <h3 className="text-card-title text-text-navy-900">
                      Selected spacing drives the rhythm
                    </h3>
                  </div>
                  <div className="rounded-full bg-primary-blue-50 px-3 py-1 text-caption font-semibold text-primary-blue-600">
                    {selected.pixels}px
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-card-sm bg-neutral-100 p-4">
                    <div className="h-16 rounded-card-sm bg-primary-blue-100" />
                  </div>
                  <div className="rounded-card-sm bg-neutral-100 p-4">
                    <div className="h-16 rounded-card-sm bg-secondary-orange-100" />
                  </div>
                  <div className="rounded-card-sm bg-neutral-100 p-4">
                    <div className="h-16 rounded-card-sm bg-neutral-200" />
                  </div>
                </div>

                <div className="rounded-card-sm bg-neutral-50 p-4 text-body-sm text-neutral-600">
                  This preview uses {selected.pixels}px for both card padding and stack gap.
                </div>
              </div>
            </div>
          </PreviewPanel>

          <SectionCard
            className="h-full"
            description="These are the implementation values to copy directly into Procurely layouts."
            title="Selected Token"
          >
            <DetailStack
              items={[
                { label: "Base unit", value: `${selected.pixels}px` },
                {
                  label: "Tailwind classes",
                  value: (
                    <div className="flex flex-wrap justify-end gap-2">
                      {selected.tailwind.map((className) => (
                        <CodeTag key={className}>{className}</CodeTag>
                      ))}
                    </div>
                  ),
                },
                { label: "Usage", value: selected.usage },
              ]}
            />
          </SectionCard>
        </div>
      </SectionCard>

      <SectionCard
        description="Section spacing compounds from the same scale: outer section spacing, internal panel padding, then content gaps inside each panel."
        title="Compounded Layout Rhythm"
      >
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <PreviewPanel className="bg-primary-navy text-text-inverse">
            <div className="flex h-full flex-col gap-4 rounded-card">
              <div className="text-caption uppercase tracking-eyebrow text-white/70">
                Sidebar uses `p-card`
              </div>
              <div className="space-y-3">
                <div className="h-10 rounded-button bg-white/10" />
                <div className="h-10 rounded-button bg-white/10" />
                <div className="h-10 rounded-button bg-white/10" />
              </div>
            </div>
          </PreviewPanel>

          <div className="grid gap-6">
            <PreviewPanel>
              <div className="space-y-6">
                <div className="h-6 w-40 rounded-full bg-secondary-orange-100" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="h-28 rounded-card bg-neutral-100" />
                  <div className="h-28 rounded-card bg-neutral-100" />
                </div>
              </div>
            </PreviewPanel>
            <div className="flex flex-wrap gap-2">
              <CodeTag>py-section</CodeTag>
              <CodeTag>p-card</CodeTag>
              <CodeTag>gap-6</CodeTag>
              <CodeTag>gap-4</CodeTag>
            </div>
          </div>
        </div>
      </SectionCard>
    </DocsShell>
  );
}
