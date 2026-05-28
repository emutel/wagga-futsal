import { prisma } from "@/lib/prisma";
import TeamsClient from "./TeamsClient";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const [teams, allPlayers, allCompetitions] = await Promise.all([
    prisma.team.findMany({
      include: {
        _count: { select: { players: true } },
        competitions: {
          include: { competition: { select: { id: true, name: true, season: true } } },
        },
        players: {
          include: { player: true },
          orderBy: { jerseyNumber: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.player.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    prisma.competition.findMany({
      select: { id: true, name: true, season: true },
      where: { status: { not: "COMPLETED" } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-black text-navy mb-6">Teams</h1>
      <TeamsClient
        initialTeams={teams}
        allPlayers={allPlayers}
        allCompetitions={allCompetitions}
      />
    </div>
  );
}
