import { prisma } from "@/lib/prisma";
import { publicJson, publicOptions, type ApiResult } from "@/lib/publicApi";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export function OPTIONS() {
  return publicOptions();
}

// GET /api/public/v1/competitions/:id/results
// Completed / forfeited / abandoned fixtures with scores, most recent first.
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const rows = await prisma.fixture.findMany({
    where: {
      competitionId: id,
      status: { in: ["COMPLETED", "FORFEITED_HOME", "FORFEITED_AWAY", "ABANDONED"] },
    },
    orderBy: [{ scheduledAt: "desc" }],
    select: {
      id: true,
      round: true,
      scheduledAt: true,
      status: true,
      phase: true,
      homeScore: true,
      awayScore: true,
      homeTeam: { select: { id: true, name: true } },
      awayTeam: { select: { id: true, name: true } },
      pitch: { select: { name: true } },
    },
  });

  const results: ApiResult[] = rows.map((f) => ({
    id: f.id,
    round: f.round,
    scheduledAt: f.scheduledAt.toISOString(),
    status: f.status,
    phase: f.phase,
    homeScore: f.homeScore,
    awayScore: f.awayScore,
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    venue: f.pitch?.name ?? null,
  }));

  return publicJson({ results });
}
