import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/forms/signup-form";
import { readLocalContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Create Account | Procurely",
  description: "Join Procurely to start procuring building materials smarter and faster. Register today for BoQ-based procurement and reliable delivery.",
  keywords: "signup, register, Procurely account, join, construction materials",
};

export default async function SignupPage() {
  const content = await readLocalContent();

  return (
    <AuthShell
      image={content.authScreens.signup.image}
      pageLabel="create an account"
      title={content.authScreens.signup.title}
    >
      <SignupForm />
    </AuthShell>
  );
}
