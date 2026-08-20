"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

export default function AuthButton() {
  const { configured, loading, user, openAuth, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-white/60" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => openAuth("signin")} className="rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white md:px-4 md:text-sm">
          Log in
        </button>
        <button type="button" onClick={() => openAuth("signup")} className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm sm:block">
          Sign up
        </button>
        {!configured && <span className="hidden text-[10px] font-semibold text-amber-600 lg:inline">Auth setup pending</span>}
      </div>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    "Account";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-10 items-center gap-2 rounded-full bg-white/90 p-1 pr-3 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white">
        {avatar ? (
          <img src={avatar} alt="" className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-[11px] font-black text-white">{initials(displayName)}</span>
        )}
        <span className="hidden max-w-28 truncate sm:block">{displayName}</span>
        <span className="text-[10px] text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[80] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-2xl">
          <div className="px-3 py-2">
            <div className="truncate font-bold text-slate-900">{displayName}</div>
            <div className="mt-0.5 truncate text-xs text-slate-400">{user.email}</div>
          </div>
          <div className="my-1 h-px bg-slate-100" />
          <Link href="/editor" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-slate-700 hover:bg-slate-50">Your designs</Link>
          <Link href="/editor?new=1" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-slate-700 hover:bg-slate-50">Create design</Link>
          <button type="button" onClick={async () => { setOpen(false); await signOut(); }} className="w-full rounded-xl px-3 py-2.5 text-left font-semibold text-rose-600 hover:bg-rose-50">Log out</button>
        </div>
      )}
    </div>
  );
}
