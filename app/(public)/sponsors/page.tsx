import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Our Sponsors" };

const TIER_LABELS: Record<string, string> = {
  PLATINUM: "Platinum Sponsors",
  GOLD: "Gold Sponsors",
  SILVER: "Silver Sponsors",
  BRONZE: "Bronze Sponsors",
};

const TIER_ORDER = ["PLATINUM", "GOLD", "SILVER", "BRONZE"];

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const byTier = TIER_ORDER.reduce<Record<string, typeof sponsors>>((acc, tier) => {
    const group = sponsors.filter((s) => s.tier === tier);
    if (group.length > 0) acc[tier] = group;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-navy mb-2">Our Sponsors</h1>
      <p className="text-muted mb-10">
        FOOTBALL WAGGA is proudly supported by these local businesses and organisations.
      </p>

      {Object.entries(byTier).map(([tier, group]) => (
        <div key={tier} className="mb-12">
          <h2 className="text-lg font-black text-navy mb-6 border-b border-border pb-2">
            {TIER_LABELS[tier]}
          </h2>
          <div className={`flex flex-wrap justify-center gap-8 ${tier === "PLATINUM" ? "gap-12" : ""}`}>
            {group.map((s) => (
              <a
                key={s.id}
                href={s.website ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 group"
              >
                {s.logoUrl ? (
                  <img
                    src={s.logoUrl}
                    alt={s.name}
                    className={`object-contain group-hover:opacity-80 transition-opacity ${
                      tier === "PLATINUM" ? "h-24" : tier === "GOLD" ? "h-16" : "h-12"
                    }`}
                  />
                ) : (
                  <div className={`flex items-center justify-center bg-navy/5 rounded-xl ${
                    tier === "PLATINUM" ? "w-48 h-24" : "w-32 h-16"
                  }`}>
                    <span className="font-bold text-navy text-center px-2">{s.name}</span>
                  </div>
                )}
                <span className="text-sm text-muted group-hover:text-brand transition-colors">{s.name}</span>
              </a>
            ))}
          </div>
        </div>
      ))}

      {sponsors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">Sponsor information coming soon.</p>
        </div>
      )}

      <div className="mt-12 bg-navy/5 rounded-2xl p-8 text-center">
        <h3 className="font-black text-navy text-xl mb-2">Become a Sponsor</h3>
        <p className="text-muted mb-4">
          Support FOOTBALL WAGGA and get your brand in front of hundreds of local families every week.
        </p>
        <a
          href="mailto:development@footballwagga.com.au"
          className="inline-block bg-brand hover:bg-brand-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}
