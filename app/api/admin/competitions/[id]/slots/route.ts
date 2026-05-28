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

  const { id: competitionId } = await params;
  const { pitchId, dayOfWeek, startTime, durationMins } = await req.json();

  if (!pitchId || dayOfWeek === undefined || !startTime) {
    return NextResponse.json(
      { error: "pitchId, dayOfWeek and startTime are required" },
      { status: 400 }
    );
  }

  const slot = await prisma.competitionTimeSlot.create({
    data: {
      competitionId,
      pitchId,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      durationMins: durationMins ?? 40,
    },
    include: { pitch: { include: { venue: true } } },
  });

  return NextResponse.json(slot, { status: 201 });
}
