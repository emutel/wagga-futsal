import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const competitions = await prisma.competition.findMany({
    include: {
      timeSlots: { include: { pitch: { include: { venue: true } } } },
      teams: { include: { team: true } },
      _count: { select: { fixtures: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(competitions);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, season, ageGroup, gender, status } = await req.json();

  if (!name || !season || !ageGroup || !gender) {
    return NextResponse.json({ error: "name, season, ageGroup and gender are required" }, { status: 400 });
  }

  const competition = await prisma.competition.create({
    data: {
      name,
      season,
      ageGroup,
      gender,
      status: status ?? "REGISTRATION",
    },
    include: {
      timeSlots: true,
      teams: { include: { team: true } },
      _count: { select: { fixtures: true } },
    },
  });

  return NextResponse.json(competition, { status: 201 });
}
