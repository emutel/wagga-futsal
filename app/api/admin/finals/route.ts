import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { getStandings } from "@/lib/standings";
import { generateFinals } from "@/lib/draw";

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { competitionId, semifinalDate, pitchId } = await req.json();

  if (!competitionId || !semifinalDate || !pitchId) {
    return NextResponse.json({ error: "competitionId, semifinalDate and pitchId required" }, { status: 400 });
  }

  const standings = await getStandings(competitionId);

  if (standings.length < 4) {
    return NextResponse.json({ error: "Need at least 4 teams in standings to generate finals" }, { status: 400 });
  }

  const finalFixtures = generateFinals(
    competitionId,
    standings,
    new Date(semifinalDate),
    pitchId
  );

  // Remove TBD grand final placeholder — created after semis are played
  const definite = finalFixtures.filter((f) => f.homeTeamId !== "TBD");

  await prisma.fixture.createMany({
    data: definite.map((f) => ({
      ...f,
      status: "SCHEDULED",
    })),
  });

  await prisma.competition.update({
    where: { id: competitionId },
    data: { status: "FINALS" },
  });

  return NextResponse.json({
    created: definite.length,
    semifinals: [
      `${standings[0].teamName} vs ${standings[3].teamName}`,
      `${standings[1].teamName} vs ${standings[2].teamName}`,
    ],
  });
}
