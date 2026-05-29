import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Next Saturday: 2026-05-30 09:00 AEST = 2026-05-29T23:00:00Z
  const nextSat = new Date("2026-05-29T23:00:00.000Z");

  const updated = await prisma.futsalSession.updateMany({
    where: { title: "Saturday Social Futsal" },
    data: { scheduledAt: nextSat },
  });

  console.log("Updated rows:", updated.count);
  console.log("New date:", nextSat.toISOString(), "= Sat 30 May 2026, 9:00 AM AEST");

  await prisma.$disconnect();
}

main().catch(console.error);
