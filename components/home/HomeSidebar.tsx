"use client";

import Link from "next/link";

const NAV = [
  { label: "Home", icon: "⌂", href: "/" },
  { label: "Create", icon: "+", href: "/editor?new=1" },
  { label: "Social", icon: "◎", href: "/editor?new=1" },
  { label: "Festival", icon: "✦", href: "/editor?format=Festival%20Poster&panel=festival&new=1" },
  { label: "Resume", icon: "▤", href: "/editor?format=A4%20Portrait&new=1" },
  { label: "Templates", icon: "▦", href: "#templates" },
  { label: "Projects", icon: "□", href: "#projects" },
];

export default function HomeSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[74px] flex-col border-r border-violet-100 bg-white/95 px-2 py-3 backdrop-blur md:flex">
      <Link
        href="/"
        className="mb-4 flex h-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 text-lg font-black text-white shadow-lg shadow-violet-200"
        title="PostMaker"
      >
        P
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

      <div className="mt-auto">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
          PM
        </div>
      </div>
    </aside>
  );
}
