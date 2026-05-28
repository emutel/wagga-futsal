import { prisma } from "@/lib/prisma";
import SessionsClient from "./SessionsClient";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const sessions = await prisma.futsalSession.findMany({
    include: {
      _count: { select: { bookings: true } },
      bookings: {
        where: { status: "CONFIRMED" },
        select: { participantCount: true },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const serialised = sessions.map((s) => ({
    ...s,
    scheduledAt: s.scheduledAt.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-black text-navy mb-6">Futsal Sessions</h1>
      <SessionsClient initialSessions={serialised} />
    </div>
  );
}
