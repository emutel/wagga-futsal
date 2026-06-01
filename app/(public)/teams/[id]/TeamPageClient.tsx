"use client";
import { useEffect, useState } from "react";

export default function TeamPageClient({ teamId, teamName }: { teamId: string; teamName: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("myTeam");
      if (stored) {
        const t = JSON.parse(stored);
        setSaved(t.id === teamId);
      }
    } catch {}
  }, [teamId]);

  const toggle = () => {
    if (saved) {
      localStorage.removeItem("myTeam");
      setSaved(false);
    } else {
      localStorage.setItem("myTeam", JSON.stringify({ id: teamId, name: teamName }));
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
        saved
          ? "bg-brand text-white hover:bg-brand-dark"
          : "bg-white border border-border text-navy hover:border-brand hover:text-brand"
      }`}
    >
      {saved ? "⭐ My Team" : "☆ Save as My Team"}
    </button>
  );
}
