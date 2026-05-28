import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doc = await prisma.rulesDocument.findFirst({
    where: { active: true },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(doc ?? null);
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, version } = await req.json();

  if (!title || !content || !version) {
    return NextResponse.json({ error: "title, content and version are required" }, { status: 400 });
  }

  // Deactivate all existing documents, then create new active one
  await prisma.rulesDocument.updateMany({ data: { active: false } });

  const doc = await prisma.rulesDocument.create({
    data: { title, content, version, active: true },
  });

  return NextResponse.json(doc, { status: 201 });
}
