"use client";

import Link from "next/link";
import {
  Crown,
  FolderOpen,
  Grid2X2,
  Home,
  LogIn,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings,
  UserRound,
} from "lucide-react";
import { useState } from "react";

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

export default function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, openAuth, signOut } = useAuth();

  const displayName = user
    ? (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      user.email ||
      "Account"
    : "Account";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/20"
            onClick={() => setMoreOpen(false)}
            aria-label="Close more menu"
          />

          <div className="absolute inset-x-0 bottom-[calc(64px_+_env(safe-area-inset-bottom))] max-h-[82dvh] overflow-y-auto rounded-t-[28px] border-t bg-white pb-4 shadow-2xl">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <h2 className="text-xl font-black text-slate-900">More</h2>
              <button
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm"
                aria-label="Close more menu"
              >
                ✕
              </button>
            </div>

            {user ? (
              <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-xs font-black text-white">
                  {avatar ? (
                    <img src={avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    initials(displayName)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-slate-900">{displayName}</div>
                  <div className="truncate text-xs text-slate-500">{user.email}</div>
                </div>
              </div>
            ) : (
              <div className="mx-4 mb-3 rounded-2xl border border-violet-100 bg-violet-50 p-3">
                <div className="text-sm font-bold text-slate-900">Sign in to Kriyavo</div>
                <div className="mt-1 text-xs text-slate-500">Access your designs and cloud autosave.</div>
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    openAuth("signin");
                  }}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white"
                >
                  <LogIn className="h-4 w-4" /> Log in
                </button>
              </div>
            )}

            <Link
              href="/pricing"
              onClick={() => setMoreOpen(false)}
              className="mx-4 mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-50 via-fuchsia-50 to-amber-50 p-4 ring-1 ring-violet-100"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Crown className="h-5 w-5 text-amber-500" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-slate-900">Kriyavo Premium</span>
                <span className="block text-xs text-slate-500">Upgrade for premium tools and content</span>
              </span>
              <span className="text-slate-400">›</span>
            </Link>

            <div className="px-3 text-sm">
              <Link href="/editor?new=1" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
                <Plus className="h-5 w-5" /><span>Create new design</span>
              </Link>
              <a href="#projects" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
                <FolderOpen className="h-5 w-5" /><span>Your designs</span>
              </a>
              <a href="#templates" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
                <Grid2X2 className="h-5 w-5" /><span>Templates</span>
              </a>
              <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500">
                <Settings className="h-5 w-5" /><span>Settings</span><span className="ml-auto text-[10px] font-semibold uppercase tracking-wide">Soon</span>
              </div>
              {user && (
                <button
                  type="button"
                  onClick={async () => {
                    setMoreOpen(false);
                    await signOut();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-5 w-5" /><span>Log out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[75] h-[calc(64px_+_env(safe-area-inset-bottom))] border-t bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur md:hidden">
        <div className="grid h-full grid-cols-4">
          <Link href="/" className="flex flex-col items-center justify-center text-[10px] font-semibold text-violet-700">
            <Home className="h-5 w-5" strokeWidth={2} />
            <span className="mt-1">Home</span>
          </Link>
          <a href="#projects" className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600">
            <FolderOpen className="h-5 w-5" strokeWidth={1.9} />
            <span className="mt-1">Your designs</span>
          </a>
          <a href="#templates" className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600">
            <Grid2X2 className="h-5 w-5" strokeWidth={1.9} />
            <span className="mt-1">Templates</span>
          </a>
          <button onClick={() => setMoreOpen((current) => !current)} className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600">
            <MoreHorizontal className="h-5 w-5" strokeWidth={2} />
            <span className="mt-1">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
