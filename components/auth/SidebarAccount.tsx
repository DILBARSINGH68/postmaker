"use client";

import Link from "next/link";
import { Crown, FolderOpen, LogOut, Plus, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
}

export default function SidebarAccount() {
  const { loading, user, openAuth, signOut } = useAuth();
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
    return <div className="mx-auto h-9 w-9 animate-pulse rounded-full bg-slate-100" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuth("signin")}
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200"
        title="Log in"
        aria-label="Log in"
      >
        <UserRound className="h-5 w-5" />
      </button>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    "Account";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div ref={ref} className="relative mx-auto">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-[11px] font-black text-white shadow-sm ring-2 ring-white transition hover:scale-105"
        title={displayName}
        aria-label="Open account menu"
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials(displayName)
        )}
      </button>

      {open && (
        <div className="absolute bottom-0 left-12 z-[120] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-2xl">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-xs font-black text-white">
              {avatar ? (
                <img src={avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                initials(displayName)
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-slate-900">{displayName}</div>
              <div className="mt-0.5 truncate text-xs text-slate-500">{user.email}</div>
            </div>
          </div>

          <div className="my-1 h-px bg-slate-100" />

          <Link
            href="/#projects"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:bg-slate-50"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Your designs</span>
          </Link>
          <Link
            href="/editor?new=1"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            <span>Create design</span>
          </Link>
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-violet-700 hover:bg-violet-50"
          >
            <Crown className="h-4 w-4 text-amber-500" />
            <span>Kriyavo Premium</span>
          </Link>

          <div className="my-1 h-px bg-slate-100" />

          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left font-semibold text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
