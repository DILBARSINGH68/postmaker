"use client";

import Link from "next/link";
import KriyavoLogo from "@/components/brand/KriyavoLogo";

const NAV = [
  { label: "Home", icon: "âŒ‚", href: "/" },
  { label: "Create", icon: "+", href: "/editor?new=1" },
  { label: "Social", icon: "â—Ž", href: "/editor?new=1" },
  { label: "Festival", icon: "âœ¦", href: "/editor?format=Festival%20Poster&panel=festival&new=1" },
  { label: "Resume", icon: "â–¤", href: "/editor?format=A4%20Portrait&new=1" },
  { label: "Templates", icon: "â–¦", href: "#templates" },
  { label: "Projects", icon: "â–¡", href: "#projects" },
];

export default function HomeSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[74px] flex-col border-r border-violet-100 bg-white/95 px-2 py-3 backdrop-blur md:flex">
      <Link
        href="/"
        className="mb-4 flex h-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
        title="Kriyavo"
      >
        <KriyavoLogo variant="mark" className="h-10 w-10" />
      </Link>

      <nav className="space-y-1">
        {NAV.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex flex-col items-center rounded-2xl px-1 py-3 text-[10px] font-medium transition ${
              index === 0
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="mt-1.5">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex justify-center">
        <KriyavoLogo variant="mark" className="h-8 w-8 opacity-90" />
      </div>
    </aside>
  );
}
