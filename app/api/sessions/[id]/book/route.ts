import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;
  const { name, email, phone, participants } = await req.json();

  if (!name || !email || !participants) {
    return NextResponse.json({ error: "Name, email and participants required" }, { status: 400 });
  }

  const session = await prisma.futsalSession.findUnique({
    where: { id: sessionId },
    include: { _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } },
  });

  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (session.status !== "OPEN") return NextResponse.json({ error: "Session not available" }, { status: 400 });

  const spotsLeft = session.capacityMax - session._count.bookings;
  if (participants > spotsLeft) {
    return NextResponse.json({ error: `Only ${spotsLeft} spots remaining` }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Create Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: session.title,
            description: `FOOTBALL WAGGA WAGGA session — ${participants} participant${participants > 1 ? "s" : ""}`,
          },
          unit_amount: session.priceCents,
        },
        quantity: participants,
      },
    ],
    success_url: `${appUrl}/sessions/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/sessions/${sessionId}`,
    metadata: { sessionId, name, email, phone: phone ?? "", participants: String(participants) },
  });

  // Pre-create booking record as PENDING
  await prisma.sessionBooking.create({
    data: {
      sessionId,
      customerName: name,
      customerEmail: email,
      customerPhone: phone ?? null,
      participantCount: Number(participants),
      stripeSessionId: checkoutSession.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ checkoutUrl: checkoutSession.url, stripeSessionId: checkoutSession.id });
}
