"use client";

import Link from "next/link";
import { useState } from "react";

import type { EditorPanel } from "@/types/editor";

type Props = {
  onText: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShape: () => void;
  onMockups: () => void;
  onDownload: () => void;
  onResize: () => void;
  onShare: () => void;
  onSaveProject: () => void;
  onTemplates: () => void;
  onProjects: () => void;
  onOpenPanel: (panel: Exclude<EditorPanel, null>) => void;
};

export default function MobileToolbar(props: Props) {
  const [showMore, setShowMore] = useState(false);

  const openPanel = (panel: Exclude<EditorPanel, null>) => {
    setShowMore(false);
    props.onOpenPanel(panel);
  };

  return (
    <>
      {showMore && (
        <div className="fixed inset-x-3 bottom-[calc(122px_+_env(safe-area-inset-bottom))] z-[70] max-h-[calc(100dvh_-_190px_-_env(safe-area-inset-bottom))] overflow-y-auto rounded-2xl border bg-white p-3 shadow-2xl md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-bold">More tools</div>
            <button
              onClick={() => setShowMore(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm"
              aria-label="Close more tools"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              ["festival", "✦", "Festival"],
              ["elements", "◫", "Elements"],
              ["frames", "▧", "Frames"],
              ["brand", "◆", "Brand"],
              ["resume", "▤", "Resume"],
              ["background", "◐", "Background"],
              ["layers", "☷", "Layers"],
            ].map(([panel, icon, label]) => (
              <button
                key={panel}
                onClick={() =>
                  openPanel(panel as Exclude<EditorPanel, null>)
                }
                className="rounded-xl bg-gray-50 px-2 py-3 text-center text-[11px] font-medium"
              >
                <span className="block text-xl">{icon}</span>
                <span className="mt-1 block">{label}</span>
              </button>
            ))}

            <button
              onClick={() => {
                setShowMore(false);
                props.onResize();
              }}
              className="rounded-xl bg-sky-50 px-2 py-3 text-center text-[11px] font-medium text-sky-700"
            >
              <span className="block text-xl">↔</span>
              <span className="mt-1 block">Resize</span>
            </button>

            <button
              onClick={() => {
                setShowMore(false);
                props.onShare();
              }}
              className="rounded-xl bg-violet-50 px-2 py-3 text-center text-[11px] font-medium text-violet-700"
            >
              <span className="block text-xl">↗</span>
              <span className="mt-1 block">Share</span>
            </button>

            <button
              onClick={() => {
                setShowMore(false);
                props.onSaveProject();
              }}
              className="rounded-xl bg-emerald-50 px-2 py-3 text-center text-[11px] font-medium text-emerald-700"
            >
              <span className="block text-xl">✓</span>
              <span className="mt-1 block">Save project</span>
            </button>

            <button
              onClick={() => {
                setShowMore(false);
                props.onDownload();
              }}
              className="rounded-xl bg-gray-900 px-2 py-3 text-center text-[11px] font-medium text-white"
            >
              <span className="block text-xl">↓</span>
              <span className="mt-1 block">Download</span>
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-[calc(58px_+_env(safe-area-inset-bottom))] z-[60] border-t bg-white/95 px-2 py-1.5 shadow-[0_-8px_22px_rgba(15,23,42,0.06)] backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          <button onClick={props.onText} className="rounded-lg p-1.5 text-[10px]">
            <span className="block text-base font-bold">T</span>
            <span className="block">Text</span>
          </button>

          <label className="cursor-pointer rounded-lg p-1.5 text-center text-[10px]">
            <span className="block text-base">↑</span>
            <span className="block">Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={props.onUpload}
              className="hidden"
            />
          </label>

          <button onClick={props.onShape} className="rounded-lg p-1.5 text-[10px]">
            <span className="block text-base">◫</span>
            <span className="block">Shape</span>
          </button>

          <button onClick={props.onMockups} className="rounded-lg p-1.5 text-[10px]">
            <span className="block text-base">▣</span>
            <span className="block">Mockups</span>
          </button>

          <button
            onClick={props.onDownload}
            className="rounded-lg bg-black p-1.5 text-[10px] text-white"
          >
            <span className="block text-base">↓</span>
            <span className="block">Save</span>
          </button>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-[65] h-[calc(58px_+_env(safe-area-inset-bottom))] border-t bg-white/98 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid h-full grid-cols-4">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-[10px] font-medium text-gray-700"
          >
            <span className="text-lg leading-none">⌂</span>
            <span className="mt-1">Home</span>
          </Link>

          <button
            onClick={props.onProjects}
            className="flex flex-col items-center justify-center text-[10px] font-medium text-gray-700"
          >
            <span className="text-lg leading-none">□</span>
            <span className="mt-1">Your designs</span>
          </button>

          <button
            onClick={props.onTemplates}
            className="flex flex-col items-center justify-center text-[10px] font-medium text-violet-700"
          >
            <span className="text-lg leading-none">▦</span>
            <span className="mt-1">Templates</span>
          </button>

          <button
            onClick={() => setShowMore((current) => !current)}
            className="flex flex-col items-center justify-center text-[10px] font-medium text-gray-700"
          >
            <span className="text-lg leading-none">•••</span>
            <span className="mt-1">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
