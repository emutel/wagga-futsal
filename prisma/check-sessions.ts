import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const all = await prisma.futsalSession.findMany({ orderBy: { scheduledAt: "asc" } });
  console.log("Total sessions:", all.length);

  const cutoff = new Date(Date.now() - 3 * 60 * 60 * 1000);
  console.log("Server now (UTC):", new Date().toISOString());
  console.log("Filter cutoff:", cutoff.toISOString());

  for (const s of all) {
    const passes = s.scheduledAt >= cutoff && ["OPEN", "FULL"].includes(s.status);
    console.log("---");
    console.log("  title:", s.title);
    console.log("  status:", s.status);
    console.log("  scheduledAt ISO:", s.scheduledAt.toISOString());
    console.log("  passes public filter:", passes);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
