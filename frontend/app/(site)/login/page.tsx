import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/forms/login-form";
import { getProcurelyContent } from "@/lib/content";

export default async function LoginPage() {
  const content = await getProcurelyContent();

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
