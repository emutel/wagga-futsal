import { prisma } from "./prisma";

export interface StandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export async function getStandings(competitionId: string): Promise<StandingRow[]> {
  const fixtures = await prisma.fixture.findMany({
    where: {
      competitionId,
      phase: "REGULAR",
      status: { in: ["COMPLETED", "FORFEITED_HOME", "FORFEITED_AWAY"] },
    },
    include: { homeTeam: true, awayTeam: true },
  });

  const map = new Map<string, StandingRow>();

  const ensure = (teamId: string, teamName: string) => {
    if (!map.has(teamId)) {
      map.set(teamId, {
        teamId,
        teamName,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }
    return map.get(teamId)!;
  };

  for (const f of fixtures) {
    const home = ensure(f.homeTeamId, f.homeTeam.name);
    const away = ensure(f.awayTeamId, f.awayTeam.name);

    let hScore = f.homeScore;
    let aScore = f.awayScore;

    if (f.status === "FORFEITED_HOME") { hScore = 0; aScore = 5; }
    if (f.status === "FORFEITED_AWAY") { hScore = 5; aScore = 0; }

    home.played++;
    away.played++;
    home.goalsFor += hScore;
    home.goalsAgainst += aScore;
    away.goalsFor += aScore;
    away.goalsAgainst += hScore;

    if (hScore > aScore) {
      home.won++; home.points += 3;
      away.lost++;
    } else if (hScore < aScore) {
      away.won++; away.points += 3;
      home.lost++;
    } else {
      home.drawn++; home.points++;
      away.drawn++; away.points++;
    }
  }

  const rows = Array.from(map.values()).map((r) => ({
    ...r,
    goalDifference: r.goalsFor - r.goalsAgainst,
  }));

  // Sort: points → GD → GF
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return rows;
}

export async function getTopScorers(competitionId: string, limit = 10) {
  const goals = await prisma.matchEvent.groupBy({
    by: ["playerId", "playerName", "jerseyNumber"],
    where: {
      type: "GOAL",
      fixture: { competitionId },
      playerId: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  return goals.map((g) => ({
    playerId: g.playerId,
    playerName: g.playerName,
    jerseyNumber: g.jerseyNumber,
    goals: g._count.id,
  }));
}
