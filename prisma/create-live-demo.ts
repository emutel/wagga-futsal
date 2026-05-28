/**
 * Creates a demo LIVE fixture with match events so the homepage live section is visible.
 * Run with: npx tsx prisma/create-live-demo.ts
 * Revert with: npx tsx prisma/create-live-demo.ts --revert
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const revert = process.argv.includes("--revert");

  if (revert) {
    // Reset any LIVE fixtures back to SCHEDULED and delete their demo events
    const liveFixtures = await prisma.fixture.findMany({ where: { status: "LIVE" } });
    for (const f of liveFixtures) {
      await prisma.matchEvent.deleteMany({ where: { fixtureId: f.id } });
      await prisma.fixture.update({
        where: { id: f.id },
        data: { status: "SCHEDULED", homeScore: 0, awayScore: 0, homeFoulsH1: 0, awayFoulsH1: 0 },
      });
    }
    console.log(`✓ Reverted ${liveFixtures.length} LIVE fixture(s) to SCHEDULED`);
    await prisma.$disconnect();
    return;
  }

  // Find a SCHEDULED fixture to make LIVE
  const fixture = await prisma.fixture.findFirst({
    where: { status: "SCHEDULED" },
    include: { homeTeam: true, awayTeam: true, competition: true },
    orderBy: { scheduledAt: "asc" },
  });

  if (!fixture) {
    console.error("No SCHEDULED fixtures found. Run the seed first.");
    process.exit(1);
  }

  // Set it to LIVE with some realistic scores
  await prisma.fixture.update({
    where: { id: fixture.id },
    data: {
      status: "LIVE",
      homeScore: 3,
      awayScore: 2,
      homeFoulsH1: 2,
      awayFoulsH1: 1,
    },
  });

  // Add some match events
  await prisma.matchEvent.createMany({
    data: [
      { fixtureId: fixture.id, teamId: fixture.homeTeamId, type: "GOAL", minute: 4, half: 1, playerName: "Jake Morrison", jerseyNumber: 7 },
      { fixtureId: fixture.id, teamId: fixture.awayTeamId, type: "GOAL", minute: 8, half: 1, playerName: "Tom Walsh", jerseyNumber: 11 },
      { fixtureId: fixture.id, teamId: fixture.homeTeamId, type: "GOAL", minute: 11, half: 1, playerName: "Jake Morrison", jerseyNumber: 7 },
      { fixtureId: fixture.id, teamId: fixture.homeTeamId, type: "FOUL", minute: 13, half: 1, playerName: "Chris Bell", jerseyNumber: 4 },
      { fixtureId: fixture.id, teamId: fixture.awayTeamId, type: "GOAL", minute: 16, half: 1, playerName: "Sam Carter", jerseyNumber: 9 },
      { fixtureId: fixture.id, teamId: fixture.awayTeamId, type: "YELLOW_CARD", minute: 18, half: 1, playerName: "Dan Mills", jerseyNumber: 5 },
      { fixtureId: fixture.id, teamId: fixture.homeTeamId, type: "GOAL", minute: 7, half: 2, playerName: "Ryan Adams", jerseyNumber: 10 },
    ],
  });

  console.log(`✓ Set fixture to LIVE: ${fixture.homeTeam.name} 3 – 2 ${fixture.awayTeam.name}`);
  console.log(`  Competition: ${fixture.competition.name}`);
  console.log(`  Fixture ID: ${fixture.id}`);
  console.log(``);
  console.log(`  To revert: npx tsx prisma/create-live-demo.ts --revert`);

  await prisma.$disconnect();
}

main().catch(console.error);
