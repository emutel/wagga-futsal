"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface MyTeam { id: string; name: string; }

export default function MyTeamBanner() {
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("myTeam");
      if (stored) setMyTeam(JSON.parse(stored));
    } catch {}
  }, []);

  if (!myTeam) return null;

  return (
    <div className="bg-brand text-white px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm shrink-0">⚽ Your team:</span>
          <Link href={`/teams/${myTeam.id}`} className="font-black text-sm hover:underline truncate">
            {myTeam.name}
          </Link>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/teams/${myTeam.id}`} className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            View Fixtures →
          </Link>
          <button
            onClick={() => { localStorage.removeItem("myTeam"); setMyTeam(null); }}
            className="text-white/60 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
