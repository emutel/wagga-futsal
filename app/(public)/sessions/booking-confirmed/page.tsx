import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Booking Confirmed" };

export default function BookingConfirmedPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-2xl font-black text-navy mb-2">Booking Confirmed!</h1>
      <p className="text-muted mb-8">
        Your spot is locked in. A confirmation email is on its way. See you on the court!
      </p>
      <Link
        href="/sessions"
        className="inline-block bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
      >
        Browse More Sessions
      </Link>
    </div>
  );
}
