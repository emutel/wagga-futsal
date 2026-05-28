import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (token) {
    await prisma.authSession.deleteMany({ where: { token } }).catch(() => {});
    cookieStore.delete("session");
  }
  return NextResponse.json({ ok: true });
}
