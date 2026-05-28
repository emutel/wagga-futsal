import { prisma } from "@/lib/prisma";
import RefereesClient from "./RefereesClient";

export const dynamic = "force-dynamic";

export default async function RefereesPage() {
  const referees = await prisma.referee.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      _count: { select: { fieldRefGames: true } },
    },
    orderBy: { user: { name: "asc" } },
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-navy mb-6">Referees</h1>
      <RefereesClient initialReferees={referees} />
    </div>
  );
}
