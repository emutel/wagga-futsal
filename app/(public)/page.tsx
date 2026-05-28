import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStandings } from "@/lib/standings";

export const dynamic = "force-dynamic";

async function getHomepageData() {
  const [upcomingFixtures, liveFixtures, competitions, sponsors] = await Promise.all([
    prisma.fixture.findMany({
      where: { status: "SCHEDULED", scheduledAt: { gte: new Date() } },
      include: { homeTeam: true, awayTeam: true, competition: true, pitch: { include: { venue: true } } },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
    prisma.fixture.findMany({
      where: { status: "LIVE" },
      include: { homeTeam: true, awayTeam: true, competition: true },
    }),
    prisma.competition.findMany({
      where: { status: { in: ["ACTIVE", "FINALS"] } },
      take: 6,
    }),
    prisma.sponsor.findMany({
      where: { active: true },
      orderBy: [{ tier: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return { upcomingFixtures, liveFixtures, competitions, sponsors };
}

export default async function HomePage() {
  const { upcomingFixtures, liveFixtures, competitions, sponsors } = await getHomepageData();

  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand font-semibold text-sm uppercase tracking-widest mb-3">Est. 2012 · Wagga Wagga, NSW</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            WAGGA <span className="text-brand">FUTSAL</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Indoor futsal for all ages — from Under 8s to Opens. Register now and join the competition.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://playfootball.com.au/football-finder?st=location&lat=-35.1053&lng=147.3605&suburb=Wagga+Wagga&state_code=NSW&postcode=2650&clubId=75505"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Register Now
            </a>
            <Link
              href="/competition"
              className="border border-white/30 hover:border-brand text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              View Draws & Ladders
            </Link>
            <Link
              href="/sessions"
              className="border border-brand text-brand hover:bg-brand hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Live games banner */}
      {liveFixtures.length > 0 && (
        <section className="bg-live text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
            <span className="flex items-center gap-2 font-bold text-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE NOW
            </span>
            {liveFixtures.map((f) => (
              <Link
                key={f.id}
                href={`/live/${f.id}`}
                className="text-sm font-semibold hover:underline"
              >
                {f.homeTeam.name} {f.homeScore} – {f.awayScore} {f.awayTeam.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Upcoming fixtures */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-navy mb-4">Upcoming Fixtures</h2>
          {upcomingFixtures.length === 0 ? (
            <p className="text-muted">No upcoming fixtures scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcomingFixtures.map((f) => (
                <Link
                  key={f.id}
                  href={`/competition/${f.id}`}
                  className="flex items-center justify-between bg-white border border-border rounded-xl p-4 hover:border-brand transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted mb-1">
                      {f.competition.name} · {f.pitch?.venue.name ?? "TBC"} · {f.pitch?.name ?? ""}
                    </p>
                    <div className="flex items-center gap-2 font-semibold text-navy">
                      <span className="truncate">{f.homeTeam.name}</span>
                      <span className="text-muted text-sm">vs</span>
                      <span className="truncate">{f.awayTeam.name}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-semibold text-navy">
                      {new Date(f.scheduledAt).toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(f.scheduledAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/competition" className="inline-block mt-4 text-brand font-semibold hover:underline text-sm">
            View full draw →
          </Link>
        </div>

        {/* Competitions */}
        <div>
          <h2 className="text-2xl font-black text-navy mb-4">Competitions</h2>
          {competitions.length === 0 ? (
            <p className="text-muted text-sm">Season hasn't started yet.</p>
          ) : (
            <div className="space-y-2">
              {competitions.map((c) => (
                <Link
                  key={c.id}
                  href={`/competition?comp=${c.id}`}
                  className="flex items-center justify-between bg-white border border-border rounded-lg px-4 py-3 hover:border-brand transition-colors"
                >
                  <span className="font-semibold text-navy text-sm">{c.name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    c.status === "FINALS"
                      ? "bg-brand text-white"
                      : "bg-navy/10 text-navy"
                  }`}>
                    {c.status === "FINALS" ? "FINALS" : "Active"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className="border-t border-border py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-xs uppercase tracking-widest text-muted mb-6">Our Sponsors</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {sponsors.map((s) => (
                <a
                  key={s.id}
                  href={s.website ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  title={s.name}
                >
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
