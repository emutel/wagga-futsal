import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamId } = await params;
  const { competitionId } = await req.json();

  if (!competitionId) {
    return NextResponse.json({ error: "competitionId is required" }, { status: 400 });
  }

  const competitionTeam = await prisma.competitionTeam.create({
    data: { teamId, competitionId },
    include: { competition: { select: { id: true, name: true, season: true } } },
  });

  return NextResponse.json(competitionTeam, { status: 201 });
}
