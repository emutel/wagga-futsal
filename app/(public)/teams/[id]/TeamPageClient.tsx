"use client";
import { useEffect, useState } from "react";
import { getMyTeams, saveMyTeams } from "@/components/MyTeamsWidget";

const MAX_SAVED = 5;

export default function TeamPageClient({ teamId, teamName }: { teamId: string; teamName: string }) {
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const teams = getMyTeams();
    setSaved(teams.some((t) => t.id === teamId));
    setCount(teams.length);
  }, [teamId]);

  const toggle = () => {
    const teams = getMyTeams();
    if (saved) {
      const updated = teams.filter((t) => t.id !== teamId);
      saveMyTeams(updated);
      setSaved(false);
      setCount(updated.length);
    } else {
      if (teams.length >= MAX_SAVED) return; // silently cap at 5
      const updated = [...teams, { id: teamId, name: teamName }];
      saveMyTeams(updated);
      setSaved(true);
      setCount(updated.length);
    }
  };

  const atLimit = !saved && count >= MAX_SAVED;

  return (
    <button
      onClick={toggle}
      disabled={atLimit}
      title={atLimit ? `You've saved ${MAX_SAVED} teams — remove one first` : undefined}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
        saved
          ? "bg-brand text-white hover:bg-brand-dark"
          : atLimit
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white border border-border text-navy hover:border-brand hover:text-brand"
      }`}
    >
      {saved ? "⭐ Saved" : "☆ Save Team"}
    </button>
  );
}
