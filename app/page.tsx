"use client";

import Link from "next/link";
import KriyavoLogo from "@/components/brand/KriyavoLogo";
import { useMemo, useState } from "react";

import HomeSidebar from "@/components/home/HomeSidebar";
import AuthRecentProjects from "@/components/auth/AuthRecentProjects";
import AuthButton from "@/components/auth/AuthButton";
import MobileBottomNav from "@/components/home/MobileBottomNav";

import {
  FEATURED,
  FESTIVAL_COUNT,
  FESTIVAL_PREVIEWS,
  QUICK_ACTIONS,
  RESUME_PREVIEWS,
  SOCIAL_TEMPLATE_PREVIEWS,
} from "@/lib/home/dashboard";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredActions = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return QUICK_ACTIONS;

    return QUICK_ACTIONS.filter((item) =>
      `${item.title} ${item.subtitle}`.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#fafbff] text-slate-900">
      <HomeSidebar />

      <div className="md:pl-[74px]">
        <section className="relative overflow-hidden px-4 pb-10 pt-4 md:px-8">
          <div className="absolute inset-x-4 top-4 h-[340px] rounded-[32px] bg-gradient-to-br from-blue-100 via-white to-fuchsia-100 md:inset-x-8" />

          <div className="relative mx-auto max-w-7xl">
            <div className="flex items-center justify-between py-3">
              <div className="kriyavo-home-desktop-brand hidden items-center md:flex">
                <KriyavoLogo variant="full" className="h-8 w-auto max-w-[150px]" />
              </div>
              <div className="flex items-center md:hidden">
                <KriyavoLogo variant="full" className="h-9 w-auto max-w-[150px]" />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <AuthButton />
                <Link
                  href="/editor?new=1"
                  className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-violet-100 backdrop-blur hover:bg-white"
                >
                  Create design
                </Link>

                <div className="rounded-full bg-gradient-to-r from-[#7A3CFF] via-[#FF2EA6] to-[#FF8A00] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-200">
                  Free Ã¢â‚¬Â¢ No watermark
                </div>
              </div>
            </div>

            <div className="px-3 pb-8 pt-8 text-center md:pt-10">
              <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
                Social posts + resumes in one clean workspace
              </div>

              <h1 className="mx-auto max-w-4xl bg-gradient-to-r from-[#246CFF] via-[#7A3CFF] to-[#FF2EA6] bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
                What will you create today?
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Create social media posts, thumbnails and professional resumes
                with simple editing tools made for everyone.
              </p>

              <div className="mx-auto mt-7 flex max-w-3xl items-center gap-3 rounded-2xl border border-violet-300 bg-white px-4 py-4 shadow-xl shadow-violet-100/70">
                <span className="text-xl text-slate-400">Ã¢Å’â€¢</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Instagram, resume, YouTube, Facebook..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none md:text-base"
                />
              </div>
            </div>

            <div className="relative mx-auto mt-1 max-w-6xl rounded-3xl border border-white/80 bg-white/80 p-4 shadow-xl shadow-violet-100/60 backdrop-blur md:p-5">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {filteredActions.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group min-w-[118px] text-center"
                  >
                    <div
                      className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-lg font-black text-white shadow-lg transition group-hover:-translate-y-1 group-hover:scale-105`}
                    >
                      {item.icon}
                    </div>

                    <div className="mt-2 text-xs font-bold text-slate-800">
                      {item.title}
                    </div>

                    <div className="mt-1 text-[10px] text-slate-400">
                      {item.subtitle}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8 md:pb-16">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
                  Fresh ideas
                </div>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Start with something beautiful
                </h2>
              </div>

              <a href="#templates" className="text-sm font-semibold text-violet-600">
                See templates Ã¢â€ â€™
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {FEATURED.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.tone} p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.tone} opacity-80`} />
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[24px] border-white/10" />
                  <div className="absolute bottom-4 right-5 h-20 w-20 rotate-12 rounded-2xl bg-white/15" />

                  <div className="relative min-h-36">
                    <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                      {item.tag}
                    </div>

                    <h3 className="mt-5 max-w-xs text-2xl font-black">
                      {item.title}
                    </h3>

                    <p className="mt-2 max-w-xs text-sm text-white/80">
                      {item.subtitle}
                    </p>

                    <div className="mt-5 text-sm font-semibold">
                      Start creating Ã¢â€ â€™
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="templates" className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">
                  Social media
                </div>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Social post templates
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  162 editable social templates are included across major social formats.
                </p>
              </div>

              <Link
                href="/editor?new=1"
                className="hidden rounded-xl border bg-white px-4 py-2 text-sm font-semibold shadow-sm md:block"
              >
                Open editor
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {SOCIAL_TEMPLATE_PREVIEWS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group"
                >
                  <div
                    className={`relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${item.tone} p-4 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl`}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.tone} opacity-55`} />
                    <div className="relative flex h-full flex-col justify-between rounded-xl border border-white/30 bg-black/10 p-3 backdrop-blur-[1px]">
                      <div className="h-2 w-12 rounded-full bg-white/70" />
                      <div>
                        <div className="text-lg font-black text-white">
                          {item.title.split(" ")[0]}
                        </div>
                        <div className="mt-1 h-1.5 w-16 rounded-full bg-white/45" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 truncate text-sm font-semibold">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="festivals" className="mt-12">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
                  Indian festivals
                </div>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Festival posts with editable artwork
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {FESTIVAL_COUNT} festival designs covering pan-India, regional, harvest,
                  Sikh, Jain, Buddhist, Muslim, Christian and national celebrations.
                </p>
              </div>

              <Link
                href="/editor?format=Festival%20Poster&panel=festival&new=1"
                className="hidden rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white md:block"
              >
                Browse festivals
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-4 lg:grid-cols-6 md:overflow-visible">
              {FESTIVAL_PREVIEWS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group min-w-[160px] md:min-w-0"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl border bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl">
                    <img
                      src={item.image}
                      alt={`${item.title} festival template`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-2 truncate text-sm font-semibold">
                    {item.title}
                  </div>
                  <div className="truncate text-[10px] text-slate-400">
                    {item.region}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">
                  Resume maker
                </div>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Professional resumes, easy to edit
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  72 editable resume templates are included across A4 and US Letter styles.
                </p>
              </div>

              <Link
                href="/editor?format=A4%20Portrait&new=1"
                className="hidden rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:block"
              >
                Start resume
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {RESUME_PREVIEWS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border bg-white p-3 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="absolute right-3 top-3 h-10 w-10 rounded-full border-2 border-white object-cover shadow"
                        loading="lazy"
                      />
                    )}
                    <div className={`h-3 w-12 rounded-full ${item.accent}`} />
                    <div className="mt-4 h-2 w-3/4 rounded-full bg-slate-800" />
                    <div className="mt-2 h-1.5 w-1/2 rounded-full bg-slate-300" />

                    <div className="mt-5 grid grid-cols-[1fr_2fr] gap-2">
                      <div className={`min-h-24 rounded-lg ${item.accent} opacity-15`} />
                      <div className="space-y-2">
                        <div className="h-1.5 rounded-full bg-slate-300" />
                        <div className="h-1.5 rounded-full bg-slate-200" />
                        <div className="h-1.5 w-3/4 rounded-full bg-slate-200" />
                        <div className="mt-4 h-1.5 rounded-full bg-slate-300" />
                        <div className="h-1.5 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 truncate text-xs font-semibold">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="projects" className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-500">
                  Your work
                </div>
                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Continue designing
                </h2>
              </div>

              <Link href="/editor" className="text-sm font-semibold text-violet-600">
                Open projects Ã¢â€ â€™
              </Link>
            </div>

            <AuthRecentProjects />
          </section>

          <section className="mt-14 overflow-hidden rounded-[32px] bg-slate-950 p-7 text-white md:p-10">
            <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                  Kriyavo
                </div>

                <h2 className="mt-4 max-w-2xl text-3xl font-black md:text-5xl">
                  Design fast. Keep it simple. Share anywhere.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
                  A focused design app for social media creators, small businesses,
                  students and job seekers Ã¢â‚¬â€ without the clutter.
                </p>

                <Link
                  href="/editor?new=1"
                  className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950"
                >
                  Create your first design
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["100+", "Social templates"],
                  ["50+", "Resume templates"],
                  ["0Ã¢â€šÂ¹", "Core editor"],
                  ["No", "Watermark"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="text-3xl font-black">{value}</div>
                    <div className="mt-1 text-xs text-slate-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="kriyavo-site-footer mx-auto max-w-7xl px-4 pb-24 md:pl-8 md:pr-8 md:pb-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <KriyavoLogo variant="tagline" className="h-8 w-auto max-w-[190px]" />
          <div className="text-[11px] text-slate-400">(c) 2026 Kriyavo. Create - Design - Share - Grow.</div>
        </div>
      </footer>
      <MobileBottomNav />
    </main>
  );
}
