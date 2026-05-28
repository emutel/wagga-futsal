import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ tier: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(sponsors);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, logoUrl, website, tier, sortOrder, active } = await req.json();

  if (!name || !tier) {
    return NextResponse.json({ error: "name and tier are required" }, { status: 400 });
  }

  const sponsor = await prisma.sponsor.create({
    data: {
      name,
      logoUrl: logoUrl || null,
      website: website || null,
      tier,
      sortOrder: sortOrder ?? 0,
      active: active ?? true,
    },
  });

  return NextResponse.json(sponsor, { status: 201 });
}
