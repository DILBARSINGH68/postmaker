"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import type { EditorPanel } from "@/types/editor";

type Props = {
  onText: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShape: () => void; // Preserved for backwards compatibility; no longer shown in mobile footer.
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
  return <span className="flex h-5 items-center justify-center text-[18px] leading-none">{children}</span>;
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
      className="flex min-w-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-medium leading-[10px] text-gray-700 active:bg-gray-100"
      title={label}
      aria-label={label}
    >
      <ToolIcon>{children}</ToolIcon>
      <span className="max-w-[56px] truncate">{label}</span>
    </button>
  );
}

function LineIcon({ name }: { name: string }) {
  const common = "h-[19px] w-[19px]";

  if (name === "templates") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>;
  }
  if (name === "elements") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="7" cy="7" r="3"/><rect x="13" y="4" width="7" height="7" rx="1"/><path d="m5 20 4-7 4 7Z"/><path d="M16 14v6M13 17h6"/></svg>;
  }
  if (name === "frames") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>;
  }
  if (name === "mockups") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="7" y="8" width="10" height="8" rx="1"/></svg>;
  }
  if (name === "brand") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 3 8 9-8 9-8-9Z"/><path d="M8.5 12h7"/></svg>;
  }
  if (name === "background") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z"/></svg>;
  }
  if (name === "resume") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
  }
  if (name === "projects") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 7h6l2 2h8v10H4Z"/><path d="M4 7V5h6l2 2"/></svg>;
  }
  if (name === "uploads") {
    return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 16V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M5 14v5h14v-5"/></svg>;
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
        <div className="fixed inset-x-2 bottom-[calc(60px_+_env(safe-area-inset-bottom))] z-[75] h-[46dvh] max-h-[420px] overflow-hidden rounded-t-[22px] rounded-b-2xl border bg-white shadow-2xl md:hidden">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <div>
              <div className="text-[13px] font-semibold">More tools</div>
              <div className="text-[10px] text-gray-400">Canvas stays visible while you work</div>
            </div>
            <button onClick={() => setShowMore(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs" aria-label="Close more tools">✕</button>
          </div>

          <div className="grid h-[calc(100%-56px)] grid-cols-4 gap-2 overflow-y-auto p-3 pb-5">
            {[
              ["frames", "▧", "Frames"],
              ["mockups", "▣", "Mockups"],
              ["background", "◐", "Background"],
              ["resume", "▤", "Resume"],
              ["layers", "☷", "Layers"],
            ].map(([panel, icon, label]) => (
              <button key={panel} onClick={() => openPanel(panel as Exclude<EditorPanel, null>)} className="rounded-xl bg-gray-50 px-2 py-3 text-center text-[9px] font-medium text-gray-700 active:bg-gray-100">
                <span className="block text-[18px] leading-none">{icon}</span><span className="mt-1.5 block truncate">{label}</span>
              </button>
            ))}

            <button onClick={() => { setShowMore(false); props.onProjects(); }} className="rounded-xl bg-gray-50 px-2 py-3 text-center text-[9px] font-medium text-gray-700"><span className="block text-[18px]">▦</span><span className="mt-1 block">Projects</span></button>
            <button onClick={() => { setShowMore(false); props.onResize(); }} className="rounded-xl bg-sky-50 px-2 py-3 text-center text-[9px] font-medium text-sky-700"><span className="block text-[18px]">↔</span><span className="mt-1 block">Resize</span></button>
            <button onClick={() => { setShowMore(false); props.onSaveProject(); }} className="rounded-xl bg-emerald-50 px-2 py-3 text-center text-[9px] font-medium text-emerald-700"><span className="block text-[18px]">✓</span><span className="mt-1 block">Save</span></button>
            <button onClick={() => { setShowMore(false); props.onShare(); }} className="rounded-xl bg-violet-50 px-2 py-3 text-center text-[9px] font-medium text-violet-700"><span className="block text-[18px]">↗</span><span className="mt-1 block">Share</span></button>
            <button onClick={() => { setShowMore(false); props.onDownload(); }} className="rounded-xl bg-gray-900 px-2 py-3 text-center text-[9px] font-medium text-white"><span className="block text-[18px]">↓</span><span className="mt-1 block">Download</span></button>
          </div>
        </div>
      )}

      <nav className="postmaker-mobile-footer fixed inset-x-0 bottom-0 z-[70] h-[calc(58px_+_env(safe-area-inset-bottom))] border-t border-gray-200 bg-white/98 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_18px_rgba(15,23,42,0.08)] backdrop-blur md:hidden">
        <div className="flex h-[58px] items-center overflow-x-auto overscroll-x-contain px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ToolButton label="Templates" onClick={props.onTemplates}><LineIcon name="templates" /></ToolButton>
          <ToolButton label="Festival" onClick={() => openPanel("festival")}><span className="text-[18px]">✦</span></ToolButton>
          <ToolButton label="Elements" onClick={() => openPanel("elements")}><LineIcon name="elements" /></ToolButton>
          <ToolButton label="Text" onClick={props.onText}><span className="font-serif text-[20px]">T</span></ToolButton>

          <label className="flex min-w-[58px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-medium leading-[10px] text-gray-700 active:bg-gray-100">
            <ToolIcon><LineIcon name="uploads" /></ToolIcon>
            <span>Uploads</span>
            <input type="file" accept="image/*" onChange={props.onUpload} className="hidden" />
          </label>

          <ToolButton label="Brand" onClick={() => openPanel("brand")}><LineIcon name="brand" /></ToolButton>
          <ToolButton label="More" onClick={() => setShowMore((value) => !value)}><span className="text-[17px] tracking-[2px]">•••</span></ToolButton>

          <Link href="/" className="flex min-w-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-medium leading-[10px] text-gray-700">
            <ToolIcon><svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m3 11 9-7 9 7"/><path d="M5.5 10v10h13V10"/></svg></ToolIcon>
            <span>Home</span>
          </Link>
        </div>
      </nav>

      <style>{`
        @media (max-width: 767px) {
          .postmaker-mobile-footer { display: block !important; }
        }
      `}</style>
    </>
  );
}
