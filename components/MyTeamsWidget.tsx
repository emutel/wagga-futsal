"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type SavedTeam = { id: string; name: string };

export function getMyTeams(): SavedTeam[] {
  try {
    // Support old single-team format + new array format
    const raw = localStorage.getItem("myTeams") ?? localStorage.getItem("myTeam");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

export function saveMyTeams(teams: SavedTeam[]): void {
  localStorage.setItem("myTeams", JSON.stringify(teams));
  localStorage.removeItem("myTeam"); // clear old format
}

export default function MyTeamsWidget() {
  const [teams, setTeams] = useState<SavedTeam[]>([]);

  useEffect(() => {
    setTeams(getMyTeams());
    // Listen for storage changes (cross-tab updates)
    const handler = () => setTeams(getMyTeams());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (teams.length === 0) return null;

  return (
    <section className="bg-brand/5 border-b border-brand/20 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
        <span className="text-xs font-black text-brand uppercase tracking-widest shrink-0">⭐ My Teams</span>
        {teams.map((t) => (
          <Link
            key={t.id}
            href={`/teams/${t.id}`}
            className="bg-white border border-brand/30 hover:border-brand rounded-full px-4 py-1.5 text-sm font-semibold text-navy hover:text-brand transition-colors whitespace-nowrap"
          >
            {t.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
