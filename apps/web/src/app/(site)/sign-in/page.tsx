import type { Metadata } from "next";
import { SignInPanel } from "@/features/auth/SignInPanel";
import { Stage } from "@/features/stage/Stage";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <Stage label="Sign in">
      <SignInPanel />
    </Stage>
  );
}
