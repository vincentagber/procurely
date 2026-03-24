import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  CodeTag,
  DetailStack,
  DocsShell,
  SectionCard,
} from "@/storybook/support/showcase";

const paletteGroups = [
  {
    title: "Primary Electric Blue",
    items: [
      {
        name: "primary.blue.500",
        hex: "#1900FF",
        rgb: "25 0 255",
        className: "bg-primary-blue-500 text-text-inverse",
        usage: "Primary CTA, focused actions, active navigation state.",
      },
      {
        name: "primary.blue.600",
        hex: "#1500D9",
        rgb: "21 0 217",
        className: "bg-primary-blue-600",
        usage: "Primary hover and pressed states.",
      },
      {
        name: "primary.blue.50",
        hex: "#EFEEFF",
        rgb: "239 238 255",
        className: "bg-primary-blue-50 text-primary-blue-600",
        usage: "Info surfaces, subtle emphasis, active chips.",
      },
    ],
  },
  {
    title: "Text Navy",
    items: [
      {
        name: "text.navy.900",
        hex: "#13184F",
        rgb: "19 24 79",
        className: "text-text-navy-900",
        usage: "Headlines, product titles, dense interface text.",
      },
      {
        name: "text.navy.700",
        hex: "#22283B",
        rgb: "34 40 59",
        className: "text-text-navy-700",
        usage: "Button labels, field labels, secondary high-emphasis text.",
      },
      {
        name: "text.navy.500",
        hex: "#4D586F",
        rgb: "77 88 111",
        className: "text-text-navy-500",
        usage: "Supporting body text, helper copy, metadata.",
      },
    ],
  },
  {
    title: "Secondary Orange",
    items: [
      {
        name: "secondary.orange.500",
        hex: "#FF6F4D",
        rgb: "255 111 77",
        className: "bg-secondary-orange-500 text-text-inverse",
        usage: "Eyebrow accents, emphasis, promo highlights.",
      },
      {
        name: "secondary.orange.100",
        hex: "#FFE2D7",
        rgb: "255 226 215",
        className: "bg-secondary-orange-100 text-secondary-orange-700",
        usage: "Warm supporting chips and highlight backgrounds.",
      },
      {
        name: "secondary.orange.50",
        hex: "#FFF2ED",
        rgb: "255 242 237",
        className: "bg-secondary-orange-50",
        usage: "Soft promo or notification surfaces.",
      },
    ],
  },
  {
    title: "Neutral Surface Scale",
    items: [
      {
        name: "neutral.0",
        hex: "#FFFFFF",
        rgb: "255 255 255",
        className: "bg-neutral-0",
        usage: "Cards, drawers, elevated surfaces.",
      },
      {
        name: "neutral.100",
        hex: "#F6F7FD",
        rgb: "246 247 253",
        className: "bg-neutral-100",
        usage: "Page canvas, form fills, subtle backgrounds.",
      },
      {
        name: "neutral.300",
        hex: "#D0D6E3",
        rgb: "208 214 227",
        className: "border-neutral-300",
        usage: "Borders, dividers, inactive outline controls.",
      },
    ],
  },
  {
    title: "Semantic States",
    items: [
      {
        name: "state.success.500",
        hex: "#16A34A",
        rgb: "22 163 74",
        className: "text-state-success-700 bg-state-success-50",
        usage: "Success feedback, confirmations, positive status.",
      },
      {
        name: "state.error.500",
        hex: "#E11D48",
        rgb: "225 29 72",
        className: "text-state-error-700 bg-state-error-50",
        usage: "Validation errors, destructive feedback, alerts.",
      },
      {
        name: "state.info.500",
        hex: "#2563EB",
        rgb: "37 99 235",
        className: "text-state-info-700 bg-state-info-50",
        usage: "Informational notices and non-critical guidance.",
      },
    ],
  },
];

const semanticUsage = [
  {
    label: "Primary actions",
    value: "Use `primary.blue.500` at rest and `primary.blue.600` on hover or active.",
  },
  {
    label: "Body and headline text",
    value: "Use the text navy scale, never pure black, to preserve Procurely’s softer editorial tone.",
  },
  {
    label: "Surface and border treatment",
    value: "Use neutral.100 for soft fills, neutral.0 for raised cards, and neutral.300 for structural borders.",
  },
  {
    label: "Feedback states",
    value: "Use semantic state tokens for success, error, and info surfaces so form messaging stays consistent.",
  },
];

const meta = {
  title: "Design System/Color Palette",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "All Procurely colors are exposed semantically in Tailwind. This story maps visual swatches back to their semantic names, RGB values, and the Tailwind classes engineers should apply directly.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SemanticPalette: Story = {
  render: () => (
    <DocsShell
      description="Designers can reference semantic token names, and engineers can lift the exact Tailwind classes shown on each swatch without guessing how those colors are intended to behave."
      eyebrow="Foundation"
      title="Color Palette"
    >
      {paletteGroups.map((group) => (
        <SectionCard
          description={`Procurely usage guidance for the ${group.title.toLowerCase()} scale.`}
          key={group.title}
          title={group.title}
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {group.items.map((item) => (
              <div
                className="rounded-card border border-border-subtle bg-surface-raised p-4 shadow-card-soft"
                key={item.name}
              >
                <div
                  className="h-28 rounded-card-sm border border-black/5"
                  style={{ backgroundColor: item.hex }}
                />
                <div className="mt-4">
                  <h3 className="text-product-title text-text-navy-900">{item.name}</h3>
                  <p className="mt-2 text-body-sm text-neutral-600">{item.usage}</p>
                </div>
                <div className="mt-4">
                  <DetailStack
                    items={[
                      { label: "HEX", value: item.hex },
                      { label: "RGB", value: item.rgb },
                      {
                        label: "Tailwind",
                        value: <CodeTag>{item.className}</CodeTag>,
                      },
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}

      <SectionCard
        description="These semantic pairings keep the interface consistent across components, states, and platforms."
        title="Semantic Usage Guide"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {semanticUsage.map((item) => (
            <div
              className="rounded-card border border-border-subtle bg-neutral-50 p-5"
              key={item.label}
            >
              <h3 className="text-body-lg font-semibold text-text-navy-900">
                {item.label}
              </h3>
              <p className="mt-2 text-body-sm text-neutral-600">{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </DocsShell>
  ),
};
