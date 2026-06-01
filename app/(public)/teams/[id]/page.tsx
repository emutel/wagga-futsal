import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import TeamPageClient from "./TeamPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const team = await prisma.team.findUnique({ where: { id } });
  return { title: team ? `${team.name} — Football Wagga` : "Team" };
}

function fmt(date: Date | string, type: "date" | "time" | "daydate") {
  const d = new Date(date);
  if (type === "time") return d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", timeZone: "Australia/Sydney" });
  if (type === "daydate") return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", timeZone: "Australia/Sydney" });
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: "Australia/Sydney" });
}

// Known competition-wide BYE weeks (no games scheduled these Saturdays)
const GENERAL_BYES = [
  { date: new Date("2026-06-06T00:00:00+10:00"), label: "Long Weekend — No games scheduled" },
  { date: new Date("2026-07-11T00:00:00+10:00"), label: "General BYE — No games scheduled" },
];

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = new Date();

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      competitions: { include: { competition: true } },
    },
  });
  if (!team) notFound();

  const competitionIds = team.competitions.map((ct) => ct.competitionId);
  const competitions = team.competitions.map((ct) => ct.competition);

  // Only FUTURE upcoming fixtures
  const upcomingFixtures = await prisma.fixture.findMany({
    where: {
      OR: [{ homeTeamId: id }, { awayTeamId: id }],
      status: "SCHEDULED",
      scheduledAt: { gte: now },
    },
    include: {
      homeTeam: true, awayTeam: true, competition: true,
      pitch: { include: { venue: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const recentFixtures = await prisma.fixture.findMany({
    where: { OR: [{ homeTeamId: id }, { awayTeamId: id }], status: { in: ["COMPLETED", "FORFEITED_HOME", "FORFEITED_AWAY"] } },
    include: { homeTeam: true, awayTeam: true, competition: true },
    orderBy: { scheduledAt: "desc" },
    take: 5,
  });

  // ── BYE detection ────────────────────────────────────────────────────────────
  // Team BYEs: rounds where the competition has other games but this team doesn't play
  let teamByeEntries: Array<{ round: number; scheduledAt: Date; competitionName: string }> = [];

  if (competitionIds.length > 0) {
    const allCompFixtures = await prisma.fixture.findMany({
      where: {
        competitionId: { in: competitionIds },
        status: "SCHEDULED",
        scheduledAt: { gte: now },
      },
      select: { round: true, scheduledAt: true, competitionId: true },
      orderBy: { scheduledAt: "asc" },
    });

    // One entry per round per competition (earliest fixture time)
    const roundMap = new Map<string, { round: number; scheduledAt: Date; competitionId: string }>();
    for (const f of allCompFixtures) {
      const key = `${f.competitionId}:${f.round}`;
      if (!roundMap.has(key)) roundMap.set(key, { round: f.round, scheduledAt: f.scheduledAt, competitionId: f.competitionId });
    }

    // Which round+comp keys does this team have fixtures for?
    const teamRoundKeys = new Set(upcomingFixtures.map((f) => `${f.competitionId}:${f.round}`));

    for (const [key, { round, scheduledAt, competitionId }] of roundMap) {
      if (!teamRoundKeys.has(key)) {
        const comp = team.competitions.find((ct) => ct.competitionId === competitionId);
        if (comp) {
          teamByeEntries.push({ round, scheduledAt, competitionName: comp.competition.name });
        }
      }
    }
  }

  // General BYEs: only show if they're still in the future and team is mid-season
  const lastFixtureDate = upcomingFixtures.at(-1)?.scheduledAt ?? null;
  const generalByeEntries = GENERAL_BYES.filter(
    (b) => b.date >= now && (!lastFixtureDate || b.date <= lastFixtureDate)
  );

  // ── Build unified schedule ───────────────────────────────────────────────────
  type ScheduleItem =
    | { kind: "fixture"; fixture: (typeof upcomingFixtures)[0]; dateKey: string }
    | { kind: "teambye"; round: number; scheduledAt: Date; competitionName: string; dateKey: string }
    | { kind: "generalbye"; label: string; scheduledAt: Date; dateKey: string };

  const schedule: ScheduleItem[] = [
    ...upcomingFixtures.map((f) => ({
      kind: "fixture" as const,
      fixture: f,
      dateKey: fmt(f.scheduledAt, "daydate"),
    })),
    ...teamByeEntries.map((b) => ({
      kind: "teambye" as const,
      ...b,
      dateKey: fmt(b.scheduledAt, "daydate"),
    })),
    ...generalByeEntries.map((b) => ({
      kind: "generalbye" as const,
      label: b.label,
      scheduledAt: b.date,
      dateKey: fmt(b.date, "daydate"),
    })),
  ].sort((a, b) => {
    const da = a.kind === "fixture" ? a.fixture.scheduledAt : a.scheduledAt;
    const db = b.kind === "fixture" ? b.fixture.scheduledAt : b.scheduledAt;
    return new Date(da).getTime() - new Date(db).getTime();
  });

  // Group by date
  const byDate: Record<string, ScheduleItem[]> = {};
  for (const item of schedule) {
    if (!byDate[item.dateKey]) byDate[item.dateKey] = [];
    byDate[item.dateKey].push(item);
  }

  const nextGame = upcomingFixtures[0] ?? null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <Link href="/competition" className="text-brand text-sm font-semibold hover:underline mb-4 inline-block">← All Competitions</Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-navy">{team.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {competitions.map((c) => (
                <Link key={c.id} href={`/competition?comp=${c.id}`} className="text-xs bg-navy/10 hover:bg-navy/20 text-navy font-semibold px-3 py-1 rounded-full transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <TeamPageClient teamId={id} teamName={team.name} />
            <a
              href={`/api/teams/${id}/calendar`}
              download
              className="flex items-center gap-2 bg-navy hover:bg-navy-mid text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              📅 Sync to Calendar
            </a>
          </div>
        </div>
      </div>

      {/* Next game hero card */}
      {nextGame ? (
        <div className="bg-navy rounded-2xl p-6 mb-8 text-white">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-semibold">Next Game</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black rounded px-2 py-1 shrink-0 ${nextGame.homeTeamId === id ? "bg-brand text-white" : "bg-white/20 text-white"}`}>HOME</span>
                <span className={`font-black text-lg leading-tight ${nextGame.homeTeamId === id ? "text-brand" : "text-white"}`}>{nextGame.homeTeam.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black rounded px-2 py-1 shrink-0 ${nextGame.awayTeamId === id ? "bg-brand text-white" : "bg-white/20 text-white"}`}>AWAY</span>
                <span className={`font-black text-lg leading-tight ${nextGame.awayTeamId === id ? "text-brand" : "text-white"}`}>{nextGame.awayTeam.name}</span>
              </div>
            </div>
            <div className="text-right shrink-0 border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6">
              <p className="text-2xl font-black text-white">{fmt(nextGame.scheduledAt, "time")}</p>
              <p className="text-white/70 text-sm">{fmt(nextGame.scheduledAt, "daydate")}</p>
              {nextGame.pitch && (
                <>
                  <p className="text-brand font-semibold text-sm mt-1">{nextGame.pitch.name}</p>
                  <p className="text-white/50 text-xs">{nextGame.pitch.venue.name}</p>
                  {nextGame.pitch.venue.mapImage && (
                    <Link href="/venues" className="text-xs text-brand hover:underline font-semibold mt-1 inline-block">🗺️ View field map</Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex gap-3 flex-wrap">
            <a
              href={nextGame.pitch?.venue.address ? `https://maps.google.com/?q=${encodeURIComponent(nextGame.pitch.venue.address)}` : "https://maps.google.com/?q=Bolton+Park+Wagga+Wagga"}
              target="_blank" rel="noopener noreferrer"
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-semibold transition-colors"
            >
              📍 Get Directions
            </a>
            <a
              href={`/api/teams/${id}/calendar`}
              download
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-semibold transition-colors"
            >
              📅 Add to Calendar
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl p-6 mb-8 text-center">
          <p className="text-4xl mb-2">✅</p>
          <p className="font-semibold text-navy">Season complete</p>
          <p className="text-muted text-sm mt-1">No upcoming fixtures</p>
        </div>
      )}

      {/* Full schedule */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-navy mb-5">Full Schedule</h2>
        {Object.keys(byDate).length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold text-navy">No upcoming fixtures</p>
            <p className="text-muted text-sm mt-1">All games have been played</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(byDate).map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-brand text-white text-xs font-black px-3 py-1 rounded-full">{date}</div>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="space-y-3">
                  {items.map((item, idx) => {
                    if (item.kind === "fixture") {
                      const f = item.fixture;
                      const isHome = f.homeTeamId === id;
                      const opponent = isHome ? f.awayTeam : f.homeTeam;
                      return (
                        <div key={f.id} className="bg-white border border-border rounded-xl overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted mb-2">{f.competition.name}</p>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs font-black rounded px-1.5 py-0.5 shrink-0 ${isHome ? "bg-brand text-white" : "bg-navy/10 text-navy"}`}>
                                      {isHome ? "HOME" : "AWAY"}
                                    </span>
                                    <span className="font-black text-navy">{team.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black rounded px-1.5 py-0.5 shrink-0 bg-navy/10 text-navy">
                                      {isHome ? "AWAY" : "HOME"}
                                    </span>
                                    <span className="font-semibold text-navy/70">{opponent.name}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xl font-black text-navy">{fmt(f.scheduledAt, "time")}</p>
                                {f.pitch && <p className="text-sm font-semibold text-brand">{f.pitch.name}</p>}
                                {f.pitch?.venue && <p className="text-xs text-muted">{f.pitch.venue.name}</p>}
                              </div>
                            </div>
                          </div>
                          {f.pitch && (
                            <div className="bg-navy/5 px-4 py-2 flex items-center justify-between gap-4 border-t border-border">
                              <div className="flex items-center gap-3">
                                {f.pitch.venue.mapImage && (
                                  <Link href="/venues" className="text-xs text-brand font-semibold hover:underline">🗺️ Field map</Link>
                                )}
                                <a
                                  href={f.pitch.venue.address ? `https://maps.google.com/?q=${encodeURIComponent(f.pitch.venue.address)}` : "https://maps.google.com/?q=Bolton+Park+Wagga+Wagga"}
                                  target="_blank" rel="noopener noreferrer"
                                  className="text-xs text-muted hover:text-brand font-semibold transition-colors"
                                >
                                  📍 Directions
                                </a>
                              </div>
                              <p className="text-xs text-muted">{f.pitch.venue.name}</p>
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (item.kind === "teambye") {
                      return (
                        <div key={`bye-${item.competitionName}-${item.round}`} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                          <span className="text-2xl">☕</span>
                          <div>
                            <p className="font-black text-amber-800 text-sm">BYE — Round {item.round}</p>
                            <p className="text-amber-700 text-xs">{item.competitionName} · No fixture this round</p>
                          </div>
                        </div>
                      );
                    }

                    if (item.kind === "generalbye") {
                      return (
                        <div key={`generalbye-${idx}`} className="bg-gray-50 border border-border rounded-xl p-4 flex items-center gap-3">
                          <span className="text-2xl">📅</span>
                          <div>
                            <p className="font-black text-navy text-sm">{item.label}</p>
                            <p className="text-muted text-xs">All competitions — no games this week</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent results */}
      {recentFixtures.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-navy mb-4">Recent Results</h2>
          <div className="space-y-2">
            {recentFixtures.map((f) => {
              const isHome = f.homeTeamId === id;
              const opponent = isHome ? f.awayTeam : f.homeTeam;
              return (
                <div key={f.id} className="bg-white border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted mb-1">{f.competition.name} · {fmt(f.scheduledAt, "date")}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black rounded px-1.5 py-0.5 shrink-0 ${isHome ? "bg-navy text-white" : "bg-navy/10 text-navy"}`}>{isHome ? "H" : "A"}</span>
                        <span className="font-bold text-navy text-sm truncate">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black rounded px-1.5 py-0.5 shrink-0 ${!isHome ? "bg-navy text-white" : "bg-navy/10 text-navy"}`}>{!isHome ? "H" : "A"}</span>
                        <span className="font-semibold text-navy/70 text-sm truncate">{opponent.name}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted font-semibold shrink-0 bg-navy/10 px-2 py-1 rounded">FT</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
