"use client";

import Link from "next/link";
import KriyavoLogo from "@/components/brand/KriyavoLogo";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

export default function EditorAuthGate({ children }: { children: ReactNode }) {
  const { configured, loading, user, openAuth } = useAuth();

  // Safe installation mode: until Supabase keys are added, the existing editor keeps working.
  if (!configured) return children;

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#f6f7fb] p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <div className="mt-4 text-sm font-semibold text-slate-500">Opening your workspace...</div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7f8fc] p-5">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-violet-300/45 blur-3xl" />
        <div className="relative w-full max-w-md rounded-[30px] border border-white bg-white/90 p-7 text-center shadow-2xl shadow-violet-100/60 backdrop-blur">
          <KriyavoLogo variant="mark" className="mx-auto h-16 w-16" />
          <h1 className="mt-5 text-2xl font-black tracking-tight text-slate-950">Sign in to start designing</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Your account keeps your Kriyavo workspace private and prepares your designs for cloud sync across mobile and desktop.</p>
          <button type="button" onClick={() => openAuth("signin")} className="mt-6 h-11 w-full rounded-xl bg-gradient-to-r from-[#7A3CFF] via-[#FF2EA6] to-[#FF8A00] text-sm font-black text-white shadow-lg shadow-violet-100">Log in</button>
          <button type="button" onClick={() => openAuth("signup")} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700">Create free account</button>
          <Link href="/" className="mt-5 inline-flex text-xs font-semibold text-slate-400 hover:text-slate-600">← Back to home</Link>
        </div>
      </main>
    );
  }

  return children;
}
