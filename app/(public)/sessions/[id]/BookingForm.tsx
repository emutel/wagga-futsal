"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Pre-load Stripe (non-blocking)
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

export default function BookingForm({
  sessionId,
  spotsLeft,
  priceCents,
}: {
  sessionId: string;
  spotsLeft: number;
  priceCents: number;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = ((priceCents * participants) / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/sessions/${sessionId}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, participants }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Booking failed. Please try again.");
      return;
    }

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl p-6 space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-navy mb-1">Full Name *</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-1">Email *</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-1">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          placeholder="0400 000 000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-1">
          Number of Participants *
        </label>
        <select
          value={participants}
          onChange={(e) => setParticipants(Number(e.target.value))}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {Array.from({ length: Math.min(spotsLeft, 10) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted text-sm">Total</span>
          <span className="font-black text-navy text-xl">${total}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 text-lg"
        >
          {loading ? "Redirecting to payment…" : `Pay $${total}`}
        </button>
        <p className="text-xs text-muted text-center mt-2">Secure payment via Stripe</p>
      </div>
    </form>
  );
}
