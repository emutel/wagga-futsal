import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowed = ["name", "season", "ageGroup", "gender", "status"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const competition = await prisma.competition.update({
    where: { id },
    data,
    include: {
      timeSlots: { include: { pitch: { include: { venue: true } } } },
      teams: { include: { team: true } },
      _count: { select: { fixtures: true } },
    },
  });

  return NextResponse.json(competition);
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.competition.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
