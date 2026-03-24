import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { motion } from "framer-motion";

import { AuthFeedback } from "@/components/forms/auth-elements";
import { TextField } from "@/components/forms/form-field";
import { ProductCard } from "@/components/product-card";
import { primaryProduct } from "@/storybook/fixtures/procurely-content";
import {
  CodeTag,
  DocsShell,
  PreviewPanel,
  SectionCard,
} from "@/storybook/support/showcase";

const meta = {
  title: "Motion/State Transition Patterns",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "State transitions in Procurely are not ad hoc. Buttons, cards, and form feedback all use the same color, motion, and elevation rules documented below.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonAndCardStates: Story = {
  render: () => (
    <DocsShell
      description="Hover, loading, and disabled states should be obvious without being loud. Cards use lift and shadow changes, while buttons use color shifts and motion restraint."
      eyebrow="Motion"
      title="Button And Card States"
    >
      <SectionCard
        description="Primary actions should feel active and responsive in every state."
        title="Button State Matrix"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <PreviewPanel>
            <button
              className="inline-flex h-12 w-full items-center justify-center rounded-button bg-primary-blue-500 text-button font-semibold text-text-inverse shadow-button"
              type="button"
            >
              Default
            </button>
          </PreviewPanel>
          <PreviewPanel>
            <motion.button
              className="inline-flex h-12 w-full items-center justify-center rounded-button bg-primary-blue-600 text-button font-semibold text-text-inverse shadow-button"
              type="button"
              whileHover={{ y: -2 }}
            >
              Hover
            </motion.button>
          </PreviewPanel>
          <PreviewPanel>
            <button
              className="inline-flex h-12 w-full cursor-progress items-center justify-center rounded-button bg-primary-blue-500 text-button font-semibold text-text-inverse opacity-70"
              type="button"
            >
              Loading...
            </button>
          </PreviewPanel>
          <PreviewPanel>
            <button
              className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-button bg-primary-navy text-button font-semibold text-text-inverse opacity-55"
              disabled
              type="button"
            >
              Disabled
            </button>
          </PreviewPanel>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <CodeTag>hover:bg-primary-blue-600</CodeTag>
          <CodeTag>disabled:state-disabled</CodeTag>
          <CodeTag>transition-interactive</CodeTag>
        </div>
      </SectionCard>

      <SectionCard
        description="Product cards rely on elevation, not exaggerated transforms, to communicate interactivity."
        title="Product Card Hover State"
      >
        <div className="max-w-[320px]">
          <ProductCard product={primaryProduct} />
        </div>
      </SectionCard>
    </DocsShell>
  ),
};

export const FormFeedbackPatterns: Story = {
  render: () => (
    <DocsShell
      description="Forms need consistent success, error, focus, and helper states. These are the exact patterns used across auth, quote request, and newsletter capture."
      eyebrow="Motion"
      title="Form Feedback Patterns"
    >
      <SectionCard
        description="Feedback should surface the right semantic color and hierarchy without introducing custom one-off patterns."
        title="Success And Error Messaging"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <AuthFeedback tone="success">
            Reset instructions have been prepared for this email address.
          </AuthFeedback>
          <AuthFeedback tone="error">
            A valid email address is required.
          </AuthFeedback>
        </div>
      </SectionCard>

      <SectionCard
        description="Field states should clearly communicate focus and validation status."
        title="Field Interaction States"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <PreviewPanel>
            <TextField
              defaultValue="procurely@projectteam.com"
              label="Focused Field"
              placeholder="Email Address"
            />
          </PreviewPanel>
          <PreviewPanel>
            <TextField
              error="This field is required."
              label="Error Field"
              placeholder="Company Name"
            />
          </PreviewPanel>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <CodeTag>focus:shadow-focus</CodeTag>
          <CodeTag>text-state-error-700</CodeTag>
          <CodeTag>animate-status-pop</CodeTag>
        </div>
      </SectionCard>
    </DocsShell>
  ),
};
