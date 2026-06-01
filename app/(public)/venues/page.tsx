import Image from "next/image";
import { Suspense } from "react";
import VenueScrollHelper from "@/components/VenueScrollHelper";

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{
    field?: string;
    venue?: string;
    home?: string;
    away?: string;
    time?: string;
    date?: string;
    comp?: string;
  }>;
}) {
  const p = await searchParams;
  const hasGame = !!(p.field && p.home && p.away);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Game context banner — shown when arriving from a fixture */}
      {hasGame && (
        <div className="bg-navy text-white rounded-2xl p-5 mb-8 shadow-lg">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3 font-semibold">
            🗺️ You&apos;re looking for…
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-black text-lg text-white leading-snug">
                {p.home}{" "}
                <span className="text-white/40 font-normal text-sm">vs</span>{" "}
                {p.away}
              </p>
              {p.comp && <p className="text-white/60 text-xs mt-0.5">{p.comp}</p>}
              {p.date && <p className="text-white/70 text-sm mt-1">{p.date}</p>}
              {p.time && !p.date && <p className="text-white/70 text-sm mt-1">{p.time}</p>}
              {p.time && p.date && <p className="text-white/60 text-sm">{p.time}</p>}
            </div>
            <div className="shrink-0 text-right bg-white/10 rounded-xl px-5 py-3">
              <p className="text-3xl font-black text-brand leading-none">{p.field}</p>
              <p className="text-white/60 text-xs mt-1">{p.venue}</p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-black text-navy mb-2">Venues &amp; Field Maps</h1>
      <p className="text-muted mb-10">Find your field on game day.</p>

      {/* Auto-scroll to the right venue section */}
      <Suspense fallback={null}>
        <VenueScrollHelper />
      </Suspense>

      {/* Bolton Park */}
      <div id="bolton-park" className="mb-12 scroll-mt-24">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-navy">Bolton Park</h2>
            <p className="text-muted text-sm">Cnr Bourke &amp; Tompson Streets, Wagga Wagga NSW 2650</p>
          </div>
          <a
            href="https://maps.google.com/?q=Bolton+Park+Wagga+Wagga+NSW"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📍 Get Directions
          </a>
        </div>

        {/* Field highlight if game is at Bolton Park */}
        {hasGame && p.venue?.toLowerCase().includes("bolton") && p.field && (
          <div className="bg-brand/10 border border-brand/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-2xl">📌</span>
            <p className="font-semibold text-navy text-sm">
              Your game is on <span className="text-brand font-black">{p.field}</span> — find it highlighted on the map below.
            </p>
          </div>
        )}

        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <Image
            src="/bolton-park-map.jpg"
            alt="Bolton Park field map showing fields 1-15, F4ALL and Senior field"
            width={1200}
            height={900}
            className="w-full object-contain"
          />
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted">
              Bolton Park has 15 numbered fields, F4ALL and a Senior field.
              {hasGame && p.venue?.toLowerCase().includes("bolton") && p.field && (
                <> Your fixture is on <strong className="text-navy">{p.field}</strong>.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Duke of Kent */}
      <div id="duke-of-kent" className="mb-12 scroll-mt-24">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-navy">Duke of Kent Park</h2>
            <p className="text-muted text-sm">Duke of Kent Drive, Wagga Wagga NSW 2650</p>
          </div>
          <a
            href="https://maps.google.com/?q=Duke+of+Kent+Park+Wagga+Wagga+NSW"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            📍 Get Directions
          </a>
        </div>

        {hasGame && p.venue?.toLowerCase().includes("duke") && p.field && (
          <div className="bg-brand/10 border border-brand/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <span className="text-2xl">📌</span>
            <p className="font-semibold text-navy text-sm">
              Your game is on <span className="text-brand font-black">{p.field}</span> — find it on the map below.
            </p>
          </div>
        )}

        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <Image
            src="/duke-of-kent-map.jpg"
            alt="Duke of Kent Park field map showing fields 1-6"
            width={1200}
            height={900}
            className="w-full object-contain"
          />
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted">
              Duke of Kent Park has 6 fields.
              {hasGame && p.venue?.toLowerCase().includes("duke") && p.field && (
                <> Your fixture is on <strong className="text-navy">{p.field}</strong>.</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Away venues */}
      <div>
        <h2 className="text-2xl font-black text-navy mb-4">Away Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "bull-paddock", name: "Bull Paddock, Tumut", address: "Tumut NSW", q: "Bull+Paddock+Tumut+NSW" },
            { id: "burns-park", name: "Burns Park, Junee", address: "Junee NSW", q: "Burns+Park+Junee+NSW" },
          ].map((v) => (
            <div
              key={v.name}
              id={v.id}
              className="bg-white border border-border rounded-2xl p-4 flex items-center justify-between gap-4 scroll-mt-24"
            >
              <div>
                <p className="font-bold text-navy">{v.name}</p>
                <p className="text-muted text-xs">{v.address}</p>
              </div>
              <a
                href={`https://maps.google.com/?q=${v.q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand text-sm font-semibold hover:underline shrink-0"
              >
                📍 Directions
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
