"use client";

import Link from "next/link";
import {
  FileText,
  FolderOpen,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  Plus,
  Sparkles,
} from "lucide-react";

import KriyavoLogo from "@/components/brand/KriyavoLogo";

const NAV = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Create", icon: Plus, href: "/editor?new=1" },
  { label: "Social", icon: ImageIcon, href: "/editor?new=1" },
  { label: "Festival", icon: Sparkles, href: "/editor?format=Festival%20Poster&panel=festival&new=1" },
  { label: "Resume", icon: FileText, href: "/editor?format=A4%20Portrait&new=1" },
  { label: "Templates", icon: LayoutGrid, href: "#templates" },
  { label: "Projects", icon: FolderOpen, href: "#projects" },
];

export default function HomeSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[68px] flex-col border-r border-slate-200/80 bg-white/95 px-1.5 py-2.5 backdrop-blur md:flex">
      <Link
        href="/"
        className="mb-3 flex h-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200"
        title="Kriyavo"
      >
        <KriyavoLogo variant="mark" className="h-9 w-9" />
      </Link>

      <nav className="space-y-0.5">
        {NAV.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex min-h-[54px] flex-col items-center justify-center rounded-xl px-1 py-1.5 text-[9px] font-semibold leading-none transition ${
                index === 0
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="mt-1.5 max-w-[58px] truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex justify-center pb-1">
        <KriyavoLogo variant="mark" className="h-7 w-7 opacity-90" />
      </div>
    </aside>
  );
}
