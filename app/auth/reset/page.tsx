"use client";

import Link from "next/link";
import KriyavoLogo from "@/components/brand/KriyavoLogo";
import { useState, type FormEvent } from "react";

import { getSupabase, isSupabaseConfigured } from "@/lib/auth/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) setError(updateError.message);
    else setMessage("Password updated. You can continue to Kriyavo.");
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f8fc] p-5">
      <div className="w-full max-w-md rounded-[28px] border bg-white p-7 shadow-xl">
        <KriyavoLogo variant="mark" className="h-12 w-12" />
        <h1 className="mt-5 text-2xl font-black text-slate-950">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter a new password for your Kriyavo account.</p>

        {!isSupabaseConfigured && <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">Supabase keys are missing.</div>}

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" autoComplete="new-password" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400" />
          {error && <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</div>}
          {message && <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{message}</div>}
          <button disabled={busy || !isSupabaseConfigured} className="h-11 w-full rounded-xl bg-slate-950 text-sm font-bold text-white disabled:opacity-50">{busy ? "Updating..." : "Update password"}</button>
        </form>

        <Link href="/" className="mt-5 inline-flex text-xs font-semibold text-violet-600">Back to Kriyavo</Link>
      </div>
    </main>
  );
}
