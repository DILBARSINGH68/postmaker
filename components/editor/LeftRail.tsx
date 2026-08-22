"use client";

import SidebarAccount from "@/components/auth/SidebarAccount";
import type { ReactNode } from "react";
import type { EditorPanel } from "@/types/editor";

type Props = {
  activePanel: EditorPanel;
  onTogglePanel: (panel: Exclude<EditorPanel, null>) => void;
};

type RailItem = {
  key: Exclude<EditorPanel, null>;
  label: string;
  icon: ReactNode;
};

const iconClass = "h-[18px] w-[18px]";

const ITEMS: RailItem[] = [
  { key: "templates", label: "Templates", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="7" height="7" rx="1.2"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><rect x="4" y="13" width="7" height="7" rx="1.2"/><rect x="13" y="13" width="7" height="7" rx="1.2"/></svg> },
  { key: "festival", label: "Festival", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l1.5 4.1L18 9l-4.5 1.9L12 15l-1.5-4.1L6 9l4.5-1.9L12 3Z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/></svg> },
  { key: "elements", label: "Elements", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="7" cy="7" r="3"/><rect x="13" y="4" width="7" height="7" rx="1.2"/><path d="m5 20 4-7 4 7Z"/><path d="M16.5 14v6M13.5 17h6"/></svg> },
  { key: "frames", label: "Frames", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg> },
  { key: "mockups", label: "Mockups", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="7" y="8" width="10" height="8" rx="1"/></svg> },
  { key: "brand", label: "Brand", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 3 8 9-8 9-8-9Z"/><path d="M8.5 12h7"/></svg> },
  { key: "resume", label: "Resume", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg> },
  { key: "text", label: "Text", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 5h14M12 5v14M9 19h6"/></svg> },
  { key: "uploads", label: "Uploads", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 16V4"/><path d="m7.5 8.5 4.5-4.5 4.5 4.5"/><path d="M5 14v5h14v-5"/></svg> },
  { key: "background", label: "Background", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z"/></svg> },
  { key: "layers", label: "Layers", icon: <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/></svg> },
];

export default function LeftRail({ activePanel, onTogglePanel }: Props) {
  return (
    <aside
      className="postmaker-desktop-rail hidden h-full min-h-0 shrink-0 flex-col overflow-visible border-r border-gray-200 bg-white py-2 md:flex"
      style={{ width: 66, flex: "0 0 66px" }}
      aria-label="Editor tools"
    >
      <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-1">
        {ITEMS.map((item) => {
          const active = activePanel === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTogglePanel(item.key)}
              title={item.label}
              aria-label={item.label}
              className={`flex w-full flex-col items-center justify-center rounded-xl px-1 py-2 transition ${
                active
                  ? "bg-[#111827] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
              }`}
            >
              <span className="flex h-5 items-center justify-center">{item.icon}</span>
              <span className="mt-1 max-w-[58px] truncate text-[9px] font-medium leading-[11px] tracking-[-0.01em]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-gray-100 px-1 pt-2">
        <SidebarAccount />
      </div>

      <style>{`
        @media (max-width: 767px) {
          .postmaker-desktop-rail { display: none !important; width: 0 !important; }
        }
      `}</style>
    </aside>
  );
}
