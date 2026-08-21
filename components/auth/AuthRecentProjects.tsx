"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import RecentProjects from "@/components/home/RecentProjects";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  listCloudProjects,
  mergeProjectLists,
  setCurrentCloudDesignId,
} from "@/lib/editor/cloudStorage";
import { loadProjects, saveAutosave } from "@/lib/editor/storage";
import type { SavedProject } from "@/types/editor";

export default function AuthRecentProjects() {
  const router = useRouter();
  const { configured, loading, user, openAuth } = useAuth();
  const [cloudProjects, setCloudProjects] = useState<SavedProject[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);

  useEffect(() => {
    if (!configured || !user) {
      setCloudProjects([]);
      return;
    }

    let cancelled = false;
    setCloudLoading(true);

    void listCloudProjects(user.id).then((projects) => {
      if (cancelled) return;
      setCloudProjects(projects);
      setCloudLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [configured, user?.id]);

  const projects = useMemo(() => {
    if (typeof window === "undefined") return cloudProjects.slice(0, 8);
    return mergeProjectLists(loadProjects(), cloudProjects).slice(0, 8);
  }, [cloudProjects]);

  if (!configured) return <RecentProjects />;

  if (loading || cloudLoading) {
    return <div className="h-28 animate-pulse rounded-2xl border bg-white" />;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-6 text-center shadow-sm">
        <div className="text-sm font-bold text-slate-800">Sign in to see your designs</div>
        <div className="mt-1 text-xs text-slate-400">Your account keeps designs available across your signed-in devices.</div>
        <button type="button" onClick={() => openAuth("signin")} className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white">Log in</button>
      </div>
    );
  }

  if (projects.length === 0) return <RecentProjects />;

  const openProject = async (project: SavedProject) => {
    setCurrentCloudDesignId(user.id, project.id);
    await saveAutosave(
      project.design,
      project.format,
      project.background,
      project.pages,
      project.activePageIndex
    );
    router.push("/editor");
  };

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
      {projects.map((project, index) => (
        <button
          key={project.id}
          type="button"
          onClick={() => void openProject(project)}
          className="group min-w-0 text-left"
        >
          <div
            className="aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 p-4 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-xl"
            style={{
              background:
                project.background && project.background !== "#ffffff"
                  ? project.background
                  : `linear-gradient(135deg, ${["#ede9fe", "#cffafe", "#dcfce7", "#fee2e2"][index % 4]}, #ffffff)`,
            }}
          >
            <div className="flex h-full items-center justify-center rounded-xl border border-black/5 bg-white/70 text-center backdrop-blur">
              <div>
                <div className="text-2xl font-black text-slate-800">{(project.name || "P").slice(0, 1).toUpperCase()}</div>
                <div className="mt-1 text-[10px] text-slate-500">{project.format?.name || "Design"}</div>
                <div className="mt-2 text-[9px] font-bold uppercase tracking-wide text-violet-600">Cloud synced</div>
              </div>
            </div>
          </div>
          <div className="mt-2 truncate text-sm font-semibold text-slate-800">{project.name || "Untitled Design"}</div>
        </button>
      ))}
    </div>
  );
}
