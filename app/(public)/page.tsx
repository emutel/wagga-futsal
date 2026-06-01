import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import TeamSearch from "@/components/TeamSearch";

export const dynamic = "force-dynamic";

async function getHomepageData() {
  const [upcomingFixtures, liveFixtures, recentResults, competitions, sponsors] =
    await Promise.all([
      prisma.fixture.findMany({
        where: { status: "SCHEDULED" },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
          pitch: { include: { venue: true } },
        },
        orderBy: { scheduledAt: "asc" },
        take: 6,
      }),
      prisma.fixture.findMany({
        where: { status: "LIVE" },
        include: {
          homeTeam: true,
          awayTeam: true,
          competition: true,
          pitch: { include: { venue: true } },
          events: { orderBy: { createdAt: "desc" }, take: 3, include: { team: true } },
        },
      }),
      prisma.fixture.findMany({
        where: { status: { in: ["COMPLETED", "FORFEITED_HOME", "FORFEITED_AWAY"] } },
        include: { homeTeam: true, awayTeam: true, competition: true },
        orderBy: { scheduledAt: "desc" },
        take: 4,
      }),
      prisma.competition.findMany({
        where: { status: { in: ["ACTIVE", "FINALS"] } },
        include: { _count: { select: { teams: true, fixtures: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.sponsor.findMany({
        where: { active: true },
        orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
      }),
    ]);

  return { upcomingFixtures, liveFixtures, recentResults, competitions, sponsors };
}

function fmt(date: Date | string, type: "date" | "time") {
  const d = new Date(date);
  if (type === "date") return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", timeZone: "Australia/Sydney" });
  return d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", timeZone: "Australia/Sydney" });
}

const EVENT_ICONS: Record<string, string> = { GOAL: "⚽", YELLOW_CARD: "🟨", RED_CARD: "🟥", FOUL: "🚫" };

export default async function HomePage() {
  const { upcomingFixtures, liveFixtures, recentResults, competitions, sponsors } = await getHomepageData();

  // Group upcoming fixtures by round date
  const fixturesByDate = upcomingFixtures.reduce((acc, f) => {
    const dateKey = fmt(f.scheduledAt, "date");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(f);
    return acc;
  }, {} as Record<string, typeof upcomingFixtures>);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        {/* Decorative pitch lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-3">
              Wagga Wagga, NSW
            </p>
            <h1 className="text-5xl md:text-6xl font-black mb-4 text-white">
              FOOTBALL <span className="text-brand">WAGGA WAGGA</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Wagga Wagga's home of football — MiniRoos through to Opens. Register now and play in 2026.
            </p>
            <div className="w-full max-w-lg mb-4">
              <TeamSearch placeholder="Find your team..." />
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="https://playfootball.com.au/football-finder?st=location&lat=-35.1053&lng=147.3605&suburb=Wagga+Wagga&state_code=NSW&postcode=2650&clubId=75505"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
              >
                Register Now
              </a>
              <Link href="/competition" className="border border-white/30 hover:border-brand text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                View Draws
              </Link>
              <Link href="/sessions" className="border border-brand text-brand hover:bg-brand hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                Book a Session
              </Link>
            </div>
          </div>
          <div className="shrink-0">
            <Image src="/logo.png" alt="FOOTBALL WAGGA WAGGA" width={180} height={180} className="drop-shadow-2xl" priority />
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-white/5">
          <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-white">{competitions.length}</p>
              <p className="text-xs text-white/50 uppercase tracking-wide">Active Comps</p>
            </div>
            <div>
              <p className="text-2xl font-black text-brand">{upcomingFixtures.length}+</p>
              <p className="text-xs text-white/50 uppercase tracking-wide">Upcoming Games</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">2026</p>
              <p className="text-xs text-white/50 uppercase tracking-wide">Season</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live games */}
      {liveFixtures.length > 0 && (
        <section className="bg-live px-4 py-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <span className="text-white font-black text-sm uppercase tracking-widest">Live Now</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liveFixtures.map((f) => (
                <Link key={f.id} href={`/live/${f.id}`} className="bg-white/10 hover:bg-white/20 rounded-2xl p-4 transition-colors">
                  <p className="text-white/70 text-xs mb-3">{f.competition.name} · {f.pitch?.venue.name}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-sm flex-1 truncate">{f.homeTeam.name}</span>
                    <span className="font-black text-white text-2xl shrink-0">vs</span>
                    <span className="font-bold text-white text-sm flex-1 truncate text-right">{f.awayTeam.name}</span>
                  </div>
                  {f.events.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/20 space-y-1">
                      {f.events.map((e) => (
                        <p key={e.id} className="text-white/80 text-xs">{EVENT_ICONS[e.type] ?? "•"} {e.minute}&apos; — {e.playerName ?? e.team.name}</p>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Competitions strip */}
      {competitions.length > 0 && (
        <section className="bg-navy/5 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-5">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-xs font-black text-muted uppercase tracking-widest shrink-0">2026 Competitions</span>
              {competitions.map((c) => (
                <Link
                  key={c.id}
                  href={`/competition?comp=${c.id}`}
                  className="shrink-0 bg-white border border-border hover:border-brand rounded-full px-4 py-1.5 text-sm font-semibold text-navy hover:text-brand transition-colors flex items-center gap-2"
                >
                  {c.name}
                  {c.status === "FINALS" && <span className="bg-brand text-white text-xs px-1.5 py-0.5 rounded-full font-bold">FINALS</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: upcoming fixtures grouped by date */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-black text-navy">This Week&apos;s Games</h2>
              <Link href="/competition" className="text-brand text-sm font-semibold hover:underline">View all →</Link>
            </div>
            {Object.keys(fixturesByDate).length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">⚽</p>
                <p className="font-semibold text-navy">No upcoming fixtures scheduled</p>
                <p className="text-muted text-sm mt-1">Check back closer to the season start</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(fixturesByDate).map(([date, fixtures]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-brand text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide">{date}</div>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="space-y-2">
                      {fixtures.map((f) => (
                        <Link
                          key={f.id}
                          href="/competition"
                          className="group flex items-center justify-between bg-white border border-border hover:border-brand rounded-xl p-4 transition-all hover:shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted mb-1.5">
                              {f.competition.name} · {f.pitch ? `${f.pitch.name}, ${f.pitch.venue.name}` : "TBC"}
                            </p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black bg-navy text-white rounded px-1.5 py-0.5 shrink-0">H</span>
                                <span className="font-bold text-navy text-sm">{f.homeTeam.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black bg-white border border-border text-navy rounded px-1.5 py-0.5 shrink-0">A</span>
                                <span className="font-semibold text-navy/70 text-sm">{f.awayTeam.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className="text-sm font-black text-navy">{fmt(f.scheduledAt, "time")}</p>
                            <p className="text-xs text-brand font-semibold group-hover:underline mt-0.5">Details →</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent results */}
          {recentResults.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-navy mb-4">Recent Results</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentResults.map((f) => (
                  <Link
                    key={f.id}
                    href={`/live/${f.id}`}
                    className="bg-white border border-border hover:border-brand rounded-xl p-4 transition-all hover:shadow-sm"
                  >
                    <p className="text-xs text-muted mb-2">{f.competition.name} · {fmt(f.scheduledAt, "date")}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy text-sm truncate flex-1">{f.homeTeam.name}</span>
                      <span className="text-xs font-black text-muted shrink-0">FT</span>
                      <span className="font-semibold text-navy text-sm truncate flex-1 text-right">{f.awayTeam.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Register CTA */}
          <div className="bg-navy rounded-2xl p-6 text-white">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2">2026 Season</p>
            <h3 className="text-xl font-black mb-2">Ready to play?</h3>
            <p className="text-white/70 text-sm mb-4">Register through PlayFootball (Football NSW) to join a competition.</p>
            <a
              href="https://playfootball.com.au/football-finder?st=location&lat=-35.1053&lng=147.3605&suburb=Wagga+Wagga&state_code=NSW&postcode=2650&clubId=75505"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-brand hover:bg-brand-dark text-white font-bold px-4 py-2.5 rounded-lg transition-colors text-sm text-center"
            >
              Register on PlayFootball →
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-black text-navy mb-3">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/competition", label: "Draws & Fixtures", icon: "📅" },
                { href: "/sessions", label: "Book a Training Session", icon: "🏃" },
                { href: "/rules", label: "Competition Rules", icon: "📋" },
                { href: "/gallery", label: "Photo Gallery", icon: "📸" },
                { href: "/sponsors", label: "Our Sponsors", icon: "🤝" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 bg-white border border-border hover:border-brand rounded-xl px-4 py-3 transition-colors group"
                >
                  <span className="text-lg">{l.icon}</span>
                  <span className="font-semibold text-navy text-sm group-hover:text-brand transition-colors">{l.label}</span>
                  <span className="ml-auto text-muted text-xs group-hover:text-brand">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Venues */}
          <div className="bg-white border border-border rounded-2xl p-4">
            <h3 className="text-base font-black text-navy mb-3">📍 Venues</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-navy">Bolton Park Stadium</p>
                <p className="text-muted text-xs">Bourke St, Wagga Wagga NSW 2650</p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="font-semibold text-navy">Jubilee Park</p>
                <p className="text-muted text-xs">Wagga Wagga NSW 2650</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className="border-t border-border py-10 px-4 bg-navy/5">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs uppercase tracking-widest text-muted mb-6">Proud Sponsors</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((s) => (
                <a key={s.id} href={s.website ?? "#"} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity" title={s.name}>
                  {s.logoUrl ? (
                    <img src={s.logoUrl} alt={s.name} className="h-10 object-contain" />
                  ) : (
                    <span className="text-navy font-bold text-sm">{s.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
