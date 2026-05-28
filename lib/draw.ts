interface DrawTeam {
  id: string;
}

interface DrawSlot {
  pitchId: string;
  dayOfWeek: number;
  startTime: string;
  durationMins: number;
}

interface Fixture {
  homeTeamId: string;
  awayTeamId: string;
  round: number;
  pitchId: string;
  scheduledAt: Date;
}

// Generate a round-robin schedule (Berger tables algorithm)
export function generateRoundRobin(teams: DrawTeam[]): Array<[string, string][]> {
  const list = [...teams];
  const hasBye = list.length % 2 !== 0;
  if (hasBye) list.push({ id: "BYE" });

  const n = list.length;
  const rounds: Array<[string, string][]> = [];

  for (let round = 0; round < n - 1; round++) {
    const pairs: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const home = list[i];
      const away = list[n - 1 - i];
      if (home.id !== "BYE" && away.id !== "BYE") {
        pairs.push([home.id, away.id]);
      }
    }
    rounds.push(pairs);

    // rotate all but first element
    const last = list.splice(n - 1, 1)[0];
    list.splice(1, 0, last);
  }

  return rounds;
}

// Given rounds and available time slots, produce scheduled fixtures
export function scheduleFixtures(
  competitionId: string,
  rounds: Array<[string, string][]>,
  slots: DrawSlot[],
  startDate: Date
): Omit<Fixture, never>[] {
  const fixtures: Fixture[] = [];
  let slotIndex = 0;
  let currentDate = new Date(startDate);

  // Advance to the first matching day of week
  const advanceToDay = (date: Date, targetDay: number): Date => {
    const d = new Date(date);
    while (d.getDay() !== targetDay) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  };

  for (let roundIdx = 0; roundIdx < rounds.length; roundIdx++) {
    const pairs = rounds[roundIdx];
    let pairIdx = 0;

    while (pairIdx < pairs.length) {
      const slot = slots[slotIndex % slots.length];
      const gameDate = advanceToDay(new Date(currentDate), slot.dayOfWeek);
      const [hour, minute] = slot.startTime.split(":").map(Number);
      gameDate.setHours(hour, minute, 0, 0);

      fixtures.push({
        homeTeamId: pairs[pairIdx][0],
        awayTeamId: pairs[pairIdx][1],
        round: roundIdx + 1,
        pitchId: slot.pitchId,
        scheduledAt: new Date(gameDate),
      });

      pairIdx++;
      slotIndex++;

      // Move to next week after filling all slots in a round
      if (pairIdx >= pairs.length) {
        currentDate = new Date(gameDate);
        currentDate.setDate(currentDate.getDate() + 7);
      }
    }
  }

  return fixtures;
}

// Generate finals fixtures from top 4 teams
export function generateFinals(
  competitionId: string,
  standings: { teamId: string }[],
  baseScheduledAt: Date,
  slotPitchId: string
) {
  const top4 = standings.slice(0, 4);
  if (top4.length < 4) throw new Error("Need at least 4 teams for finals");

  const sf1Date = new Date(baseScheduledAt);
  const sf2Date = new Date(baseScheduledAt);
  sf2Date.setMinutes(sf2Date.getMinutes() + 60);
  const gfDate = new Date(baseScheduledAt);
  gfDate.setDate(gfDate.getDate() + 7);

  return [
    {
      homeTeamId: top4[0].teamId,
      awayTeamId: top4[3].teamId,
      round: 1,
      phase: "SEMI_FINAL" as const,
      pitchId: slotPitchId,
      scheduledAt: sf1Date,
      competitionId,
    },
    {
      homeTeamId: top4[1].teamId,
      awayTeamId: top4[2].teamId,
      round: 1,
      phase: "SEMI_FINAL" as const,
      pitchId: slotPitchId,
      scheduledAt: sf2Date,
      competitionId,
    },
    {
      homeTeamId: "TBD",
      awayTeamId: "TBD",
      round: 2,
      phase: "GRAND_FINAL" as const,
      pitchId: slotPitchId,
      scheduledAt: gfDate,
      competitionId,
    },
  ];
}
