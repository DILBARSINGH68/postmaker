"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedProject = {
  id: string;
  name: string;
  background?: string;
  format?: {
    name: string;
    width: number;
    height: number;
  };
};

export default function RecentProjects() {
  const [projects, setProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("postmaker-projects");
      const parsed = raw ? JSON.parse(raw) : [];
      setProjects(Array.isArray(parsed) ? parsed.slice(0, 8) : []);
    } catch {
      setProjects([]);
    }
  }, []);

  if (projects.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Link
            key={index}
            href="/editor?new=1"
            className="group"
          >
            <div className="aspect-[4/3] rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition group-hover:-translate-y-1 group-hover:shadow-lg">
              <div className="flex h-full items-center justify-center rounded-xl bg-white text-3xl text-slate-300">
                +
              </div>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-700">
              New design
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
      {projects.map((project, index) => (
        <Link key={project.id} href="/editor" className="group min-w-0">
          <div
            className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 p-4 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl"
            style={{
              background:
                project.background && project.background !== "#ffffff"
                  ? project.background
                  : `linear-gradient(135deg, ${
                      ["#ede9fe", "#cffafe", "#dcfce7", "#fee2e2"][index % 4]
                    }, #ffffff)`,
            }}
          >
            <div className="flex h-full items-center justify-center rounded-xl border border-black/5 bg-white/65 text-center backdrop-blur">
              <div>
                <div className="text-2xl font-black text-slate-800">
                  {(project.name || "P").slice(0, 1).toUpperCase()}
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  {project.format?.name || "Design"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 truncate text-sm font-semibold text-slate-800">
            {project.name || "Untitled Design"}
          </div>
        </Link>
      ))}
    </div>
  );
}
