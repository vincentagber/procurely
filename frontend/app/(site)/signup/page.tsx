import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/forms/signup-form";
import { getProcurelyContent } from "@/lib/content";

export default async function SignupPage() {
  const content = await getProcurelyContent();

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
