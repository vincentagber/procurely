import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import {
  CodeTag,
  DetailStack,
  DocsShell,
  PreviewPanel,
  SectionCard,
} from "@/storybook/support/showcase";

const meta = {
  title: "Motion/Animation Catalog",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "This catalog documents the exact Procurely motion patterns used in production: reveal-on-scroll, hover lift, button press, and sliding panels. Each story calls out trigger, easing, duration, and implementation detail.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntranceReveal: Story = {
  render: () => (
    <MotionStory
      description="Used for section headings, cards, and content blocks as they enter the viewport."
      details={[
        { label: "Trigger", value: "On scroll / while in view" },
        { label: "Duration", value: "750ms default" },
        { label: "Easing", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Implementation", value: "Framer Motion `Reveal` helper" },
      ]}
      title="Entrance Reveal"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {["Upload BOQ", "Match Materials", "Deliver to Site"].map((label, index) => (
          <Reveal delay={index * 0.08} key={label}>
            <div className="rounded-card border border-border-subtle bg-white p-5 shadow-card-soft">
              <div className="h-12 w-12 rounded-full bg-primary-blue-50" />
              <h3 className="mt-4 text-card-title text-text-navy-900">{label}</h3>
              <p className="mt-2 text-body-sm text-neutral-600">
                Section cards fade, lift, and sharpen as they enter the viewport.
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </MotionStory>
  ),
};

export const CardHoverLift: Story = {
  render: () => (
    <MotionStory
      description="Applied to product cards, feature cards, brand tiles, and testimonial media."
      details={[
        { label: "Trigger", value: "On hover" },
        { label: "Duration", value: "240ms" },
        { label: "Easing", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Implementation", value: "Framer Motion `whileHover` + Tailwind shadow utilities" },
      ]}
      title="Card Hover Lift"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {["Product Card", "Brand Tile", "Feature Card"].map((label, index) => (
          <motion.div
            className="rounded-card border border-border-subtle bg-white p-5 shadow-card-soft"
            key={label}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -10, scale: 1.015 }}
          >
            <div
              className={`h-28 rounded-card-sm ${
                index === 0
                  ? "bg-primary-blue-50"
                  : index === 1
                    ? "bg-secondary-orange-50"
                    : "bg-neutral-100"
              }`}
            />
            <h3 className="mt-4 text-product-title text-text-navy-900">{label}</h3>
            <p className="mt-2 text-body-sm text-neutral-600">
              Hover to inspect the lift, shadow deepening, and mild scale increase.
            </p>
          </motion.div>
        ))}
      </div>
    </MotionStory>
  ),
};

export const ButtonPress: Story = {
  render: () => (
    <MotionStory
      description="Primary CTAs use a restrained lift on hover and a tighter press response on click."
      details={[
        { label: "Trigger", value: "Hover and click" },
        { label: "Duration", value: "180ms to 220ms" },
        { label: "Easing", value: "Press: cubic-bezier(0.34, 1.56, 0.64, 1)" },
        { label: "Implementation", value: "Framer Motion `whileHover` and `whileTap`" },
      ]}
      title="Button Press"
    >
      <div className="flex flex-wrap gap-4">
        <motion.button
          className="inline-flex h-14 items-center justify-center rounded-button bg-primary-blue-500 px-6 text-button font-semibold text-text-inverse shadow-button"
          transition={{ duration: 0.18 }}
          type="button"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit BOQ / Contact
        </motion.button>
        <button
          className="inline-flex h-14 items-center justify-center rounded-button border border-border-subtle bg-white px-6 text-button font-semibold text-text-navy-900"
          type="button"
        >
          Secondary Action
        </button>
      </div>
    </MotionStory>
  ),
};

export const DrawerSlide: Story = {
  render: () => <DrawerSlideDemo />,
};

function MotionStory({
  title,
  description,
  details,
  children,
}: {
  title: string;
  description: string;
  details: Array<{ label: string; value: string }>;
  children: ReactNode;
}) {
  return (
    <DocsShell
      description="Each story in this section isolates a single Procurely motion pattern so the exact timing and implementation can be reviewed without ambiguity."
      eyebrow="Motion"
      title={title}
    >
      <SectionCard description={description} title="Interactive Preview">
        <PreviewPanel>{children}</PreviewPanel>
      </SectionCard>

      <SectionCard
        description="These are the production-facing implementation notes for this specific motion pattern."
        title="Implementation Details"
      >
        <DetailStack items={details} />
        <div className="mt-4 flex flex-wrap gap-2">
          <CodeTag>transition-interactive</CodeTag>
          <CodeTag>shadow-card</CodeTag>
          <CodeTag>Framer Motion</CodeTag>
        </div>
      </SectionCard>
    </DocsShell>
  );
}

function DrawerSlideDemo() {
  const [open, setOpen] = useState(false);

  return (
    <MotionStory
      description="Used for the cart drawer and BOQ/contact drawer. The panel slides from the edge while the overlay fades in."
      details={[
        { label: "Trigger", value: "On click / explicit panel open" },
        { label: "Duration", value: "280ms" },
        { label: "Easing", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Implementation", value: "Framer Motion `AnimatePresence` + `motion.aside`" },
      ]}
      title="Drawer Slide"
    >
      <div className="relative overflow-hidden rounded-card border border-border-subtle bg-neutral-100 p-4">
        <button
          className="inline-flex h-12 items-center justify-center rounded-button bg-primary-blue-500 px-5 text-button font-semibold text-text-inverse"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          {open ? "Close Drawer" : "Open Drawer"}
        </button>

        <div className="relative mt-5 h-[320px] overflow-hidden rounded-card bg-white">
          {open ? (
            <>
              <motion.div
                className="absolute inset-0 bg-surface-overlay/25"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.aside
                className="absolute inset-y-0 right-0 w-full max-w-[320px] border-l border-border-subtle bg-white p-5 shadow-drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-eyebrow text-secondary-orange-500">Drawer</p>
                <h3 className="mt-4 text-card-title text-text-navy-900">Slide-in Panel</h3>
                <p className="mt-2 text-body-sm text-neutral-600">
                  Use this for cart and quote flows where background context should remain visible.
                </p>
              </motion.aside>
            </>
          ) : null}
        </div>
      </div>
    </MotionStory>
  );
}
