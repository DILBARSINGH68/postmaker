"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

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

function ToolIcon({ children }: { children: ReactNode }) {
  return <span className="flex h-6 items-center justify-center text-[20px] leading-none">{children}</span>;
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-w-[62px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium text-gray-700 active:bg-gray-100"
    >
      <ToolIcon>{children}</ToolIcon>
      <span className="max-w-[60px] truncate">{label}</span>
    </button>
  );
}

function LineIcon({ name }: { name: string }) {
  if (name === "templates") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>;
  }
  if (name === "elements") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="7" cy="7" r="3"/><rect x="13" y="4" width="7" height="7" rx="1"/><path d="m5 20 4-7 4 7z"/><path d="M16 14v6M13 17h6"/></svg>;
  }
  if (name === "frames") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>;
  }
  if (name === "mockups") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="7" y="8" width="10" height="8" rx="1"/></svg>;
  }
  if (name === "brand") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 8 9-8 9-8-9z"/><path d="M8.5 12h7"/></svg>;
  }
  if (name === "background") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z"/></svg>;
  }
  if (name === "resume") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
  }
  if (name === "projects") {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h6l2 2h8v10H4z"/><path d="M4 7V5h6l2 2"/></svg>;
  }
  return <span>•</span>;
}

export default function MobileToolbar(props: Props) {
  const [showMore, setShowMore] = useState(false);

  const openPanel = (panel: Exclude<EditorPanel, null>) => {
    setShowMore(false);
    props.onOpenPanel(panel);
  };

  return (
    <>
      {showMore && (
        <div className="fixed inset-x-3 bottom-[calc(70px_+_env(safe-area-inset-bottom))] z-[75] max-h-[58dvh] overflow-y-auto rounded-2xl border bg-white p-3 shadow-2xl md:hidden">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-bold">More tools</div>
            <button onClick={() => setShowMore(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm" aria-label="Close more tools">✕</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              ["festival", "✦", "Festival"],
              ["layers", "☷", "Layers"],
              ["background", "◐", "Background"],
              ["resume", "▤", "Resume"],
            ].map(([panel, icon, label]) => (
              <button key={panel} onClick={() => openPanel(panel as Exclude<EditorPanel, null>)} className="rounded-xl bg-gray-50 px-2 py-3 text-center text-[10px] font-medium">
                <span className="block text-lg">{icon}</span><span className="mt-1 block">{label}</span>
              </button>
            ))}
            <button onClick={() => { setShowMore(false); props.onResize(); }} className="rounded-xl bg-sky-50 px-2 py-3 text-center text-[10px] font-medium text-sky-700"><span className="block text-lg">↔</span><span className="mt-1 block">Resize</span></button>
            <button onClick={() => { setShowMore(false); props.onSaveProject(); }} className="rounded-xl bg-emerald-50 px-2 py-3 text-center text-[10px] font-medium text-emerald-700"><span className="block text-lg">✓</span><span className="mt-1 block">Save</span></button>
            <button onClick={() => { setShowMore(false); props.onShare(); }} className="rounded-xl bg-violet-50 px-2 py-3 text-center text-[10px] font-medium text-violet-700"><span className="block text-lg">↗</span><span className="mt-1 block">Share</span></button>
            <button onClick={() => { setShowMore(false); props.onDownload(); }} className="rounded-xl bg-gray-900 px-2 py-3 text-center text-[10px] font-medium text-white"><span className="block text-lg">↓</span><span className="mt-1 block">Download</span></button>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[70] h-[calc(64px_+_env(safe-area-inset-bottom))] border-t bg-white/98 pb-[env(safe-area-inset-bottom)] shadow-[0_-7px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="flex h-16 items-center overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ToolButton label="Templates" onClick={props.onTemplates}><LineIcon name="templates" /></ToolButton>
          <ToolButton label="Festival" onClick={() => openPanel("festival")}><span className="text-xl">✦</span></ToolButton>
          <ToolButton label="Elements" onClick={() => openPanel("elements")}><LineIcon name="elements" /></ToolButton>
          <ToolButton label="Shape" onClick={props.onShape}><span className="text-[21px]">□</span></ToolButton>
          <ToolButton label="Text" onClick={props.onText}><span className="font-serif text-[22px]">T</span></ToolButton>

          <label className="flex min-w-[62px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium text-gray-700 active:bg-gray-100">
            <ToolIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 17V7h16v10z"/><circle cx="9" cy="11" r="1.5"/><path d="m6 16 4-4 3 3 2-2 3 3"/></svg>
            </ToolIcon>
            <span>Uploads</span>
            <input type="file" accept="image/*" onChange={props.onUpload} className="hidden" />
          </label>

          <ToolButton label="Frames" onClick={() => openPanel("frames")}><LineIcon name="frames" /></ToolButton>
          <ToolButton label="Mockups" onClick={props.onMockups}><LineIcon name="mockups" /></ToolButton>
          <ToolButton label="Brand" onClick={() => openPanel("brand")}><LineIcon name="brand" /></ToolButton>
          <ToolButton label="Resume" onClick={() => openPanel("resume")}><LineIcon name="resume" /></ToolButton>
          <ToolButton label="Background" onClick={() => openPanel("background")}><LineIcon name="background" /></ToolButton>
          <ToolButton label="Projects" onClick={props.onProjects}><LineIcon name="projects" /></ToolButton>
          <Link href="/" className="flex min-w-[62px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-medium text-gray-700">
            <ToolIcon><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m3 11 9-7 9 7"/><path d="M5.5 10v10h13V10"/></svg></ToolIcon>
            <span>Home</span>
          </Link>
          <ToolButton label="More" onClick={() => setShowMore((value) => !value)}><span className="tracking-[2px]">•••</span></ToolButton>
        </div>
      </nav>
    </>
  );
}
