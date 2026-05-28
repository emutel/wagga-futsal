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
  const { playerId, jerseyNumber } = await req.json();

  if (!playerId) {
    return NextResponse.json({ error: "playerId is required" }, { status: 400 });
  }

  const teamPlayer = await prisma.teamPlayer.create({
    data: {
      teamId,
      playerId,
      jerseyNumber: jerseyNumber ? Number(jerseyNumber) : null,
    },
    include: { player: true },
  });

  return NextResponse.json(teamPlayer, { status: 201 });
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: teamId } = await params;
  const { searchParams } = new URL(req.url);
  const playerId = searchParams.get("playerId");

  if (!playerId) {
    return NextResponse.json({ error: "playerId query param required" }, { status: 400 });
  }

  await prisma.teamPlayer.deleteMany({ where: { teamId, playerId } });

  return NextResponse.json({ ok: true });
}
