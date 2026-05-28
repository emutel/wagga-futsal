import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ScorerConsole from "./ScorerConsole";

export default async function ScorerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/referee/login");

  const { id } = await params;

  const fixture = await prisma.fixture.findUnique({
    where: { id },
    include: {
      homeTeam: { include: { players: { include: { player: true } } } },
      awayTeam: { include: { players: { include: { player: true } } } },
      competition: true,
      events: { orderBy: { createdAt: "desc" }, include: { team: true }, take: 20 },
    },
  });

  if (!fixture) notFound();

  return <ScorerConsole fixture={fixture} />;
}
