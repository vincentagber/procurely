import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  CodeTag,
  DetailStack,
  DocsShell,
  PreviewPanel,
  SectionCard,
} from "@/storybook/support/showcase";

const typographyLevels = [
  {
    label: "Hero Headline",
    sample: "PROCUREMENT FOR DEVELOPERS. DONE RIGHT",
    className:
      "font-display text-[3.5rem] leading-[0.92] tracking-hero-display-md text-text-navy-900 md:text-hero-display-md",
    family: "font-display",
    weight: "700",
    size: "80px desktop / 56px compact",
    lineHeight: "0.9",
    letterSpacing: "-0.06em",
  },
  {
    label: "Section Title",
    sample: "Best Seller Materials",
    className:
      "text-section-title-md font-semibold tracking-section-title-md text-text-navy-900 md:text-section-title",
    family: "font-body",
    weight: "600",
    size: "48px desktop / 40px tablet",
    lineHeight: "1.05",
    letterSpacing: "-0.05em",
  },
  {
    label: "Feature Title",
    sample: "Fast Delivery",
    className: "text-feature-title font-semibold tracking-[-0.04em] text-text-navy-900",
    family: "font-body",
    weight: "600",
    size: "28.8px",
    lineHeight: "1.1",
    letterSpacing: "-0.04em",
  },
  {
    label: "Body Copy",
    sample:
      "BOQ-based procurement, online ordering, structured credit, and reliable delivery for modern project teams.",
    className: "text-body-base text-neutral-600",
    family: "font-body",
    weight: "400",
    size: "16px",
    lineHeight: "1.75rem",
    letterSpacing: "-0.01em",
  },
  {
    label: "Caption / Metadata",
    sample: "Decorative & Furnishing Solutions",
    className: "text-caption text-neutral-500",
    family: "font-body",
    weight: "400",
    size: "14px",
    lineHeight: "1.35rem",
    letterSpacing: "-0.005em",
  },
  {
    label: "Eyebrow",
    sample: "This Month",
    className: "text-eyebrow font-semibold uppercase tracking-eyebrow text-secondary-orange-500",
    family: "font-body",
    weight: "600",
    size: "12px",
    lineHeight: "1rem",
    letterSpacing: "0.28em",
  },
];

const meta = {
  title: "Design System/Typography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Typography is split between the condensed display face for hero moments and the body family for everything else. Each specimen below maps directly to the Tailwind classes already defined in the Procurely theme.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeHierarchy: Story = {
  render: () => (
    <DocsShell
      description="These specimens show the exact family, weight, size, line height, and letter spacing expected in production. Use the Tailwind classes shown in each specimen card as the implementation reference."
      eyebrow="Foundation"
      title="Typography"
    >
      <SectionCard
        description="Each level is shown with real Procurely copy and the exact implementation metadata."
        title="Hierarchy Specimens"
      >
        <div className="grid gap-5">
          {typographyLevels.map((level) => (
            <div
              className="grid gap-5 rounded-card border border-border-subtle bg-surface-raised p-5 shadow-card-soft lg:grid-cols-[1.2fr_0.8fr]"
              key={level.label}
            >
              <div>
                <p className="text-caption font-semibold text-secondary-orange-500">
                  {level.label}
                </p>
                <div className={`mt-4 ${level.className}`}>{level.sample}</div>
              </div>
              <DetailStack
                items={[
                  { label: "Family", value: level.family },
                  { label: "Weight", value: level.weight },
                  { label: "Size", value: level.size },
                  { label: "Line height", value: level.lineHeight },
                  { label: "Letter spacing", value: level.letterSpacing },
                ]}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        description="Typography should feel editorial, not generic. The card below shows how the headline, supporting copy, and metadata work together in a real Procurely panel."
        title="Contextual Composition"
      >
        <PreviewPanel className="bg-primary-navy text-text-inverse">
          <div className="space-y-5 rounded-card">
            <div>
              <p className="text-eyebrow text-secondary-orange-400">Procurely Design System</p>
              <h2 className="mt-4 font-display text-[3rem] leading-[0.92] tracking-hero-display-md text-text-inverse">
                MOVE FAST. BUILD RIGHT.
              </h2>
            </div>
            <p className="max-w-[720px] text-body-lg text-white/82">
              Procurement copy relies on generous line height, restrained contrast,
              and a consistent transition from display moments into readable body text.
            </p>
            <div className="flex flex-wrap gap-2">
              <CodeTag>font-display</CodeTag>
              <CodeTag>text-hero-display-md</CodeTag>
              <CodeTag>text-body-lg</CodeTag>
              <CodeTag>text-eyebrow</CodeTag>
            </div>
          </div>
        </PreviewPanel>
      </SectionCard>
    </DocsShell>
  ),
};
