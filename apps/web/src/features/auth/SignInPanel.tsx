"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { routes } from "@/lib/routes";
import { signInDemo, signOutDemo, useDemoSession } from "./demo-session";
import styles from "./SignInPanel.module.css";

type Mode = "sign-in" | "sign-up";

/**
 * The sign-in panel, UI only. Nothing is sent anywhere yet, and the real
 * buttons say so rather than pretend. The demo account is the one way in,
 * kept in this browser and labelled as a demo wherever it shows.
 */
export function SignInPanel() {
  const router = useRouter();
  const demo = useDemoSession();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [note, setNote] = useState<string | null>(null);
  const signUp = mode === "sign-up";

  if (demo) {
    return (
      <div className={styles.panel}>
        <h1 className={styles.title}>You're in the demo</h1>
        <p className={styles.lede}>
          Signed in as the demo account, in this browser only. Nothing you do is saved to a real account.
        </p>
        <Link href={routes.home} className={styles.submitLink}>
          Back to Furnishes
        </Link>
        <button type="button" className={styles.secondary} onClick={signOutDemo}>
          Sign out of the demo
        </button>
      </div>
    );
  }

  const notYet = (e?: React.FormEvent) => {
    e?.preventDefault();
    setNote("Accounts aren't switched on yet. This is a preview of the screen.");
  };

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>{signUp ? "Create an account" : "Sign in"}</h1>
      <p className={styles.lede}>Keep your rooms, saved pieces and orders in one place.</p>

      <button type="button" className={styles.google} onClick={() => notYet()}>
        <GoogleMark />
        Continue with Google
      </button>

      <div className={styles.or} role="separator">
        <span>or</span>
      </div>

      <form className={styles.form} onSubmit={notYet} noValidate>
        {signUp ? (
          <label className={styles.field}>
            <span>Name</span>
            <input type="text" name="name" autoComplete="name" />
          </label>
        ) : null}
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" inputMode="email" />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldHead}>
            Password
            {signUp ? null : (
              <button type="button" className={styles.inline} onClick={() => notYet()}>
                Forgot password?
              </button>
            )}
          </span>
          <input type="password" name="password" autoComplete={signUp ? "new-password" : "current-password"} />
        </label>
        <button type="submit" className={styles.submit}>
          {signUp ? "Create account" : "Sign in"}
        </button>
      </form>

      {note ? (
        <p className={styles.note} role="status">
          {note}
        </p>
      ) : null}

      <p className={styles.switch}>
        {signUp ? "Already have an account?" : "New to Furnishes?"}{" "}
        <button
          type="button"
          className={styles.inline}
          onClick={() => {
            setMode(signUp ? "sign-in" : "sign-up");
            setNote(null);
          }}
        >
          {signUp ? "Sign in" : "Create an account"}
        </button>
      </p>

      <button
        type="button"
        className={styles.secondary}
        onClick={() => {
          signInDemo();
          router.push(routes.home);
        }}
      >
        Try the demo account
      </button>

      <Link href={routes.home} className={styles.guest}>
        Continue without an account
      </Link>

      <p className={styles.legal}>
        By continuing you agree to the <Link href={routes.terms}>Terms</Link> and <Link href={routes.privacy}>Privacy Policy</Link>.
      </p>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.69 9c0-.6.1-1.18.28-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}
