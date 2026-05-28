import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RefereeGamesPage() {
  const session = await getSession();
  if (!session) redirect("/referee/login");

  const referee = await prisma.referee.findUnique({
    where: { userId: session.userId },
  });

  if (!referee) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Your account is not linked to a referee profile. Contact admin.</p>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const games = await prisma.fixture.findMany({
    where: {
      OR: [{ fieldRefereeId: referee.id }, { scorerId: referee.id }],
      scheduledAt: { gte: today },
      status: { in: ["SCHEDULED", "LIVE"] },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      competition: true,
      pitch: { include: { venue: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-navy mb-1">My Games</h1>
      <p className="text-muted text-sm mb-6">Your upcoming assigned fixtures</p>

      {games.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center">
          <p className="text-muted">No upcoming games assigned to you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((g) => {
            const isScorer = g.scorerId === referee.id;
            const isLive = g.status === "LIVE";

            return (
              <Link
                key={g.id}
                href={`/referee/games/${g.id}/score`}
                className={`block bg-white border rounded-xl p-4 hover:border-brand transition-colors ${
                  isLive ? "border-live" : "border-border"
                }`}
              >
                {isLive && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 bg-live rounded-full animate-pulse" />
                    <span className="text-live text-xs font-bold">LIVE</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted mb-1">{g.competition.name}</p>
                    <p className="font-bold text-navy">
                      {g.homeTeam.name} vs {g.awayTeam.name}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {g.pitch?.venue.name} · {g.pitch?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {new Date(g.scheduledAt).toLocaleDateString("en-AU", {
                        weekday: "short", day: "numeric", month: "short",
                      })}
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(g.scheduledAt).toLocaleTimeString("en-AU", {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                    <span className={`text-xs font-semibold ${isScorer ? "text-brand" : "text-navy/60"}`}>
                      {isScorer ? "Scorer" : "Field Ref"}
                    </span>
                  </div>
                </div>

                {isLive && (
                  <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                    <span className="text-2xl font-black text-navy">
                      {g.homeScore} – {g.awayScore}
                    </span>
                    <span className="text-sm text-brand font-semibold">Enter Score →</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
