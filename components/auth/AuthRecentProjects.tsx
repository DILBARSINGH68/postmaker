"use client";

import RecentProjects from "@/components/home/RecentProjects";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthRecentProjects() {
  const { configured, loading, user, openAuth } = useAuth();

  if (!configured) return <RecentProjects />;

  if (loading) {
    return <div className="h-28 animate-pulse rounded-2xl border bg-white" />;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-6 text-center shadow-sm">
        <div className="text-sm font-bold text-slate-800">Sign in to see your designs</div>
        <div className="mt-1 text-xs text-slate-400">Your existing local designs stay on this device. Cloud sync comes in the next safe update.</div>
        <button type="button" onClick={() => openAuth("signin")} className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-bold text-white">Log in</button>
      </div>
    );
  }

  return <RecentProjects />;
}
