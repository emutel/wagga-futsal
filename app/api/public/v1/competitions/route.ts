import { prisma } from "@/lib/prisma";
import { publicJson, publicOptions, type ApiCompetition } from "@/lib/publicApi";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return publicOptions();
}

// GET /api/public/v1/competitions
// Lists publicly visible competitions (excludes REGISTRATION drafts).
export async function GET() {
  const comps = await prisma.competition.findMany({
    where: { status: { in: ["ACTIVE", "FINALS", "COMPLETED"] } },
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      season: true,
      ageGroup: true,
      gender: true,
      status: true,
    },
  });

  const competitions: ApiCompetition[] = comps;
  return publicJson({ competitions });
}
