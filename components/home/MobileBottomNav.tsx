"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {moreOpen && (
        <div className="fixed inset-x-3 bottom-[calc(72px_+_env(safe-area-inset-bottom))] z-[80] max-h-[calc(100dvh_-_100px_-_env(safe-area-inset-bottom))] overflow-y-auto rounded-2xl border bg-white p-3 shadow-2xl md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-bold">More</div>
            <button
              onClick={() => setMoreOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm"
              aria-label="Close more menu"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/editor?new=1"
              className="rounded-xl bg-slate-50 p-3 text-sm font-semibold"
            >
              + Create design
            </Link>
            <Link
              href="/editor?format=Festival%20Poster&panel=festival&new=1"
              className="rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-700"
            >
              ✦ Festival posts
            </Link>
            <Link
              href="/editor?format=A4%20Portrait&new=1"
              className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"
            >
              ▤ Resume maker
            </Link>
            <Link
              href="/editor"
              className="rounded-xl bg-violet-50 p-3 text-sm font-semibold text-violet-700"
            >
              Open editor
            </Link>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[75] h-[calc(64px_+_env(safe-area-inset-bottom))] border-t bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur md:hidden">
        <div className="grid h-full grid-cols-4">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-[10px] font-semibold text-violet-700"
          >
            <span className="text-xl leading-none">⌂</span>
            <span className="mt-1">Home</span>
          </Link>

          <a
            href="#projects"
            className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600"
          >
            <span className="text-xl leading-none">□</span>
            <span className="mt-1">Your designs</span>
          </a>

          <a
            href="#templates"
            className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600"
          >
            <span className="text-xl leading-none">▦</span>
            <span className="mt-1">Templates</span>
          </a>

          <button
            onClick={() => setMoreOpen((current) => !current)}
            className="flex flex-col items-center justify-center text-[10px] font-medium text-slate-600"
          >
            <span className="text-xl leading-none">•••</span>
            <span className="mt-1">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
