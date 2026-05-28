import { prisma } from "@/lib/prisma";
import SponsorsClient from "./SponsorsClient";

export const dynamic = "force-dynamic";

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ tier: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-black text-navy mb-6">Sponsors</h1>
      <SponsorsClient initialSponsors={sponsors} />
    </div>
  );
}
