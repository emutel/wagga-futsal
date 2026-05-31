"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type MatchEvent = {
  id: string;
  type: string;
  minute: number;
  half: number;
  playerName: string | null;
  jerseyNumber: number | null;
  team: { id: string; name: string };
};

type Fixture = {
  id: string;
  homeScore: number;
  awayScore: number;
  homeFoulsH1: number;
  awayFoulsH1: number;
  homeFoulsH2: number;
  awayFoulsH2: number;
  status: string;
  scheduledAt: string | Date;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  competition: { name: string };
  pitch: { name: string; venue: { name: string } } | null;
  events: MatchEvent[];
};

const EVENT_ICONS: Record<string, string> = {
  GOAL: "⚽",
  YELLOW_CARD: "🟨",
  RED_CARD: "🟥",
  FOUL: "🚫",
};

export default function LiveMatchClient({ fixture: initial }: { fixture: Fixture }) {
  const [fixture, setFixture] = useState(initial);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/fixtures/${initial.id}`, { cache: "no-store" });
      if (res.ok) {
        setFixture(await res.json());
        setLastUpdated(new Date());
      }
    } catch {
      // silently ignore network errors
    }
  }, [initial.id]);

  useEffect(() => {
    if (fixture.status !== "LIVE") return;
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [fixture.status, refresh]);

  const isLive = fixture.status === "LIVE";
  const isCompleted = fixture.status === "COMPLETED";
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`,
        text: `${fixture.homeTeam.name} ${fixture.homeScore} – ${fixture.awayScore} ${fixture.awayTeam.name} | FOOTBALL WAGGA WAGGA`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/competition" className="text-sm text-muted hover:text-brand">
          ← Back to draw
        </Link>
        <button
          onClick={handleShare}
          className="text-sm bg-brand text-white px-3 py-1.5 rounded font-semibold hover:bg-brand-dark transition-colors"
        >
          Share Live Score
        </button>
      </div>

      {/* Score card */}
      <div className="bg-navy text-white rounded-2xl p-6 mb-6 shadow-xl">
        <div className="text-center mb-4">
          <p className="text-white/60 text-sm">{fixture.competition.name}</p>
          {fixture.pitch && (
            <p className="text-white/40 text-xs">{fixture.pitch.venue.name} · {fixture.pitch.name}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="font-black text-xl leading-tight">{fixture.homeTeam.name}</p>
            <p className="text-xs text-white/50 mt-1">Home</p>
          </div>

          <div className="text-center px-4">
            <div className="flex items-center gap-3">
              <span className="text-6xl font-black text-brand">{fixture.homeScore}</span>
              <span className="text-3xl text-white/40">–</span>
              <span className="text-6xl font-black text-brand">{fixture.awayScore}</span>
            </div>
            {isLive && (
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className="w-2 h-2 bg-live rounded-full animate-pulse" />
                <span className="text-live text-xs font-bold">LIVE</span>
              </div>
            )}
            {isCompleted && (
              <p className="text-white/50 text-xs mt-2">Full Time</p>
            )}
            {!isLive && !isCompleted && (
              <p className="text-white/50 text-xs mt-2">
                {new Date(fixture.scheduledAt).toLocaleDateString("en-AU", {
                  weekday: "short", day: "numeric", month: "short", timeZone: "Australia/Sydney"})}{" "}
                {new Date(fixture.scheduledAt).toLocaleTimeString("en-AU", {
                  hour: "2-digit", minute: "2-digit", timeZone: "Australia/Sydney"})}
              </p>
            )}
          </div>

          <div className="flex-1 text-center">
            <p className="font-black text-xl leading-tight">{fixture.awayTeam.name}</p>
            <p className="text-xs text-white/50 mt-1">Away</p>
          </div>
        </div>

        {/* Accumulated fouls */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs text-white/50">
          <span>Fouls H1: {fixture.homeFoulsH1} / {fixture.awayFoulsH1}</span>
          <span>Fouls H2: {fixture.homeFoulsH2} / {fixture.awayFoulsH2}</span>
        </div>
      </div>

      {/* Events timeline */}
      {fixture.events.length > 0 && (
        <div>
          <h2 className="font-black text-navy text-lg mb-3">Match Events</h2>
          <div className="space-y-2">
            {[...fixture.events].reverse().map((e) => (
              <div key={e.id} className="flex items-center gap-3 bg-white border border-border rounded-lg px-4 py-2.5">
                <span className="text-xl">{EVENT_ICONS[e.type] ?? "•"}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm text-navy">
                    {e.playerName ?? "Unknown"}{e.jerseyNumber ? ` (#${e.jerseyNumber})` : ""}
                  </span>
                  <span className="text-muted text-xs ml-2">{e.team.name}</span>
                </div>
                <span className="text-xs text-muted shrink-0">{e.minute}&apos; H{e.half}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLive && (
        <p className="text-center text-xs text-muted mt-6">
          Updates every 15 seconds · Last updated {lastUpdated.toLocaleTimeString("en-AU")}
        </p>
      )}
    </div>
  );
}
