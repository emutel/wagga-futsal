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
  const { bsb, accountNumber, accountName } = await req.json();

  const referee = await prisma.referee.update({
    where: { id },
    data: {
      bsb: bsb || null,
      accountNumber: accountNumber || null,
      accountName: accountName || null,
    },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });

  return NextResponse.json(referee);
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const referee = await prisma.referee.findUnique({ where: { id } });
  if (!referee) {
    return NextResponse.json({ error: "Referee not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: referee.userId } });

  return NextResponse.json({ ok: true });
}
