"use client";

import Link from "next/link";
import KriyavoLogo from "@/components/brand/KriyavoLogo";
import PremiumButton from "@/components/billing/PremiumButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, type ReactNode } from "react";

import type { Format } from "@/types/editor";

type Props = {
  projectName: string;
  saved: boolean;
  canUndo: boolean;
  canRedo: boolean;
  format: Format;
  pageCount: number;
  onProjectNameChange: (value: string) => void;
  onBack: () => void;
  onProjects: () => void;
  onResize: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShare: () => void;
  onDownload: () => void;
};

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-35">
      {children}
    </button>
  );
}

export default function EditorHeader(props: Props) {
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const { user, signOut } = useAuth();
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email ||
    "Account";

  return (
    <>
      <header className="relative z-50 h-14 shrink-0 border-b bg-white">
        <div className="hidden h-full items-center justify-between px-4 md:flex">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={props.onBack} className="rounded-lg px-3 py-2 hover:bg-gray-100" title="Back">←</button>

            <Link href="/" className="hidden items-center md:flex" title="Kriyavo Home" aria-label="Go to Kriyavo home">
              <KriyavoLogo variant="full" className="h-7 w-auto max-w-[128px]" />
            </Link>

            <input value={props.projectName} onChange={(e) => props.onProjectNameChange(e.target.value)} className="w-40 min-w-0 rounded-lg border px-3 py-2 text-sm outline-none focus:border-black md:w-60" aria-label="Project name" />
            <span className="hidden text-[11px] text-gray-400 lg:inline">{props.saved ? "Saved" : "Saving..."}</span>
          </div>

          <div className="flex items-center gap-2">
            <PremiumButton />
            <button onClick={props.onResize} className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50">Resize</button>
            <button onClick={props.onProjects} className="hidden rounded-lg border px-3 py-2 text-xs lg:block">Projects</button>
            <button onClick={props.onSave} className="hidden rounded-lg border px-3 py-2 text-xs lg:block">Save</button>
            <button onClick={props.onUndo} disabled={!props.canUndo} className="rounded-lg border px-3 py-2 disabled:opacity-30" title="Undo">↶</button>
            <button onClick={props.onRedo} disabled={!props.canRedo} className="rounded-lg border px-3 py-2 disabled:opacity-30" title="Redo">↷</button>
            <button onClick={props.onShare} className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-gray-50">Share</button>
            <button onClick={props.onDownload} className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800">Download</button>
          </div>
        </div>

        <div className="flex h-full items-center justify-between bg-gradient-to-r from-[#246CFF] via-[#7A3CFF] to-[#FF2EA6] px-2 md:hidden">
          <Link href="/" className="absolute left-1/2 -translate-x-1/2" title="Kriyavo Home" aria-label="Go to Kriyavo home">
            <KriyavoLogo variant="mark" className="kriyavo-mobile-editor-mark h-8 w-8 drop-shadow-sm" />
          </Link>

          <div className="flex items-center gap-0.5">
            <IconButton label="Home" onClick={props.onBack}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="m3 11 9-7 9 7"/><path d="M5.5 10v10h13V10"/></svg>
            </IconButton>
            <IconButton label="Undo" onClick={props.onUndo} disabled={!props.canUndo}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M9 7 4 12l5 5"/><path d="M5 12h8a6 6 0 0 1 6 6"/></svg>
            </IconButton>
            <IconButton label="Redo" onClick={props.onRedo} disabled={!props.canRedo}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="m15 7 5 5-5 5"/><path d="M19 12h-8a6 6 0 0 0-6 6"/></svg>
            </IconButton>
          </div>

          <div className="flex items-center gap-0.5">
            <IconButton label="Design details" onClick={() => setShowMobileDetails(true)}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
            </IconButton>
            <IconButton label="Premium" onClick={() => window.location.assign("/pricing")}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m4 7 4 4 4-6 4 6 4-4-2 10H6L4 7Z"/><path d="M7 20h10"/></svg>
            </IconButton>
            <IconButton label="Download" onClick={props.onDownload}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 4v11"/><path d="m7.5 11 4.5 4.5 4.5-4.5"/><path d="M5 20h14"/></svg>
            </IconButton>
            <IconButton label="Share" onClick={props.onShare}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 16V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M5 13v6h14v-6"/></svg>
            </IconButton>
          </div>
        </div>
      </header>

      {showMobileDetails && (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-label="Design details">
          <button type="button" className="absolute inset-0 bg-black/35" onClick={() => setShowMobileDetails(false)} aria-label="Close design details" />
          <div className="absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-y-auto rounded-t-[28px] bg-white pb-[calc(18px_+_env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
            <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
              <div className="min-w-0">
                <input value={props.projectName} onChange={(e) => props.onProjectNameChange(e.target.value)} className="w-full truncate bg-transparent text-lg font-bold outline-none" aria-label="Design name" />
                <div className="mt-1 text-xs text-gray-500">{props.format.name} • {props.format.width}px × {props.format.height}px • {Math.max(1, props.pageCount)} page{props.pageCount === 1 ? "" : "s"}</div>
              </div>
              <button onClick={() => setShowMobileDetails(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm" aria-label="Close">✕</button>
            </div>

            {user && (
              <div className="border-b px-5 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Account</div>
                <div className="mt-1 truncate text-sm font-bold text-gray-900">{displayName}</div>
                <div className="truncate text-xs text-gray-500">{user.email}</div>
              </div>
            )}

            <div className="divide-y px-2 py-2 text-sm">
              <div className="flex items-center justify-between px-3 py-3"><span className="font-medium">Mode</span><span className="text-gray-500">Editing</span></div>
              <Link href="/pricing" className="flex items-center gap-3 rounded-xl px-3 py-3 font-semibold text-violet-700 hover:bg-violet-50"><span className="text-lg">♛</span><span>Kriyavo Premium</span></Link>
              <button onClick={() => { setShowMobileDetails(false); props.onResize(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50"><span className="text-lg">↔</span><span>Resize design</span></button>
              <button onClick={() => { setShowMobileDetails(false); props.onProjects(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50"><span className="text-lg">▦</span><span>View your designs</span></button>
              <button onClick={() => { setShowMobileDetails(false); props.onSave(); }} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-gray-50"><span className="flex items-center gap-3"><span className="text-lg">✓</span><span>Save</span></span><span className="text-xs text-gray-400">{props.saved ? "All changes saved" : "Saving..."}</span></button>
              <Link href="/editor?new=1" className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-gray-50"><span className="text-lg">＋</span><span>Create new design</span></Link>
              <button onClick={() => { setShowMobileDetails(false); props.onDownload(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50"><span className="text-lg">↓</span><span>Download</span></button>
              <button onClick={() => { setShowMobileDetails(false); props.onShare(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-gray-50"><span className="text-lg">↗</span><span>Share</span></button>
              {user && (
                <button onClick={async () => { setShowMobileDetails(false); await signOut(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold text-rose-600 hover:bg-rose-50"><span className="text-lg">↪</span><span>Log out</span></button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
