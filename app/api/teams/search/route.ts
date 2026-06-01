import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const teams = await prisma.team.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    include: {
      competitions: {
        include: { competition: { select: { id: true, name: true } } },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
    take: 10,
  });

  return NextResponse.json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      competition: t.competitions[0]?.competition.name ?? null,
    }))
  );
}
