import { prisma } from "@/lib/prisma";
import { publicJson, publicOptions, type ApiFixture } from "@/lib/publicApi";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export function OPTIONS() {
  return publicOptions();
}

// GET /api/public/v1/competitions/:id/fixtures
// Upcoming + in-progress fixtures, soonest first.
// A 3-hour lookback keeps games that have just kicked off visible.
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000);

  const rows = await prisma.fixture.findMany({
    where: {
      competitionId: id,
      status: { in: ["SCHEDULED", "LIVE"] },
      scheduledAt: { gte: cutoff },
    },
    orderBy: [{ scheduledAt: "asc" }, { round: "asc" }],
    select: {
      id: true,
      round: true,
      scheduledAt: true,
      status: true,
      phase: true,
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
      pitch: { select: { name: true } },
    },
  });

  const fixtures: ApiFixture[] = rows.map((f) => ({
    id: f.id,
    round: f.round,
    scheduledAt: f.scheduledAt.toISOString(),
    status: f.status,
    phase: f.phase,
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    venue: f.pitch?.name ?? null,
  }));

  return publicJson({ fixtures });
}
