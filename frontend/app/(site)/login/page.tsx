import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/forms/login-form";
import { readLocalContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Login | Procurely",
  description: "Sign in to Procurely to manage your construction material orders, view BOQs, and access structured credit.",
  keywords: "login, sign in, Procurely account, construction materials procurement",
};

export default async function LoginPage() {
  const content = await readLocalContent();

  return (
    <AuthShell
      image={content.authScreens.login.image}
      pageLabel="login"
      title={content.authScreens.login.title}
    >
      <LoginForm />
    </AuthShell>
  );
}
