"use client";

import { useEffect, useState, type FormEvent } from "react";

import { getSupabase, isSupabaseConfigured } from "@/lib/auth/supabase";

export type AuthMode = "signin" | "signup";

type Props = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
};

export default function AuthModal({ open, mode: initialMode, onClose }: Props) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setMessage(null);
    setError(null);
  }, [open, initialMode]);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured yet. Add the environment variables from the setup guide first.");
      return;
    }

    if (!email.trim() || password.length < 6) {
      setError("Enter a valid email and a password with at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() || undefined },
            emailRedirectTo:
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage("Account created. Check your email to confirm your account, then sign in.");
          setMode("signin");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const continueWithGoogle = async () => {
    setError(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured yet. Add the environment variables from the setup guide first.");
      return;
    }

    setBusy(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? window.location.href.split("#")[0]
            : undefined,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    setError(null);
    setMessage(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured yet.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }

    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/reset`
          : undefined,
    });
    setBusy(false);

    if (resetError) setError(resetError.message);
    else setMessage("Password reset link sent. Check your email.");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label="PostMaker account">
      <button type="button" className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" onClick={onClose} aria-label="Close" />

      <div className="relative w-full rounded-t-[28px] bg-white p-5 shadow-2xl md:max-w-md md:rounded-[28px] md:p-7">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 md:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-black text-white">P</div>
              <div>
                <div className="text-sm font-black text-slate-900">PostMaker</div>
                <div className="text-[11px] text-slate-400">Create. Save. Access anywhere.</div>
              </div>
            </div>
            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-600 hover:bg-slate-200" aria-label="Close">✕</button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
            Login code is installed, but Supabase keys are not configured yet. Follow <b>README-AUTH-SETUP.txt</b>, then restart the app.
          </div>
        )}

        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={busy || !isSupabaseConfigured}
          className="mt-5 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-black">G</span>
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
          <div className="h-px flex-1 bg-slate-200" /> or <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Minimum 6 characters" autoComplete={mode === "signin" ? "current-password" : "new-password"} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
          </label>

          {error && <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700">{error}</div>}
          {message && <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-700">{message}</div>}

          <button type="submit" disabled={busy || !isSupabaseConfigured} className="h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-violet-100 disabled:opacity-50">
            {busy ? "Please wait..." : mode === "signin" ? "Continue" : "Create account"}
          </button>
        </form>

        {mode === "signin" && (
          <button type="button" onClick={resetPassword} disabled={busy || !isSupabaseConfigured} className="mt-3 w-full text-center text-xs font-semibold text-violet-600 disabled:opacity-50">
            Forgot password?
          </button>
        )}

        <div className="mt-5 text-center text-xs text-slate-500">
          {mode === "signin" ? "New to PostMaker?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }} className="font-bold text-violet-600">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
