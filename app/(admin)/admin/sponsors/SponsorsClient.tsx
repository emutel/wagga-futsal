"use client";

import { useState } from "react";
import AddSponsorForm from "./AddSponsorForm";

type Sponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  tier: string;
  active: boolean;
  sortOrder: number;
};

const TIER_COLOURS: Record<string, string> = {
  PLATINUM: "bg-slate-100 text-slate-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  SILVER: "bg-gray-100 text-gray-600",
  BRONZE: "bg-orange-100 text-orange-700",
};

const TIER_ORDER = ["PLATINUM", "GOLD", "SILVER", "BRONZE"];

export default function SponsorsClient({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);

  const handleCreated = (s: Sponsor) => setSponsors((prev) => [...prev, s]);

  const handleToggleActive = async (id: string, active: boolean) => {
    const res = await fetch(`/api/admin/sponsors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (res.ok) {
      const data = await res.json();
      setSponsors((prev) => prev.map((s) => (s.id === id ? data : s)));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete sponsor "${name}"?`)) return;
    await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    items: sponsors
      .filter((s) => s.tier === tier)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <div className="mb-6">
        <AddSponsorForm onCreated={handleCreated} />
      </div>

      {grouped.length === 0 ? (
        <p className="text-muted text-sm">No sponsors yet.</p>
      ) : (
        grouped.map(({ tier, items }) => (
          <div key={tier} className="mb-8">
            <h2 className="text-sm font-bold text-navy uppercase tracking-wide mb-3">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${TIER_COLOURS[tier]}`}>{tier}</span>
              {tier.charAt(0) + tier.slice(1).toLowerCase()} Sponsors
            </h2>
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-semibold">Name</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Website</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Sort</th>
                    <th className="px-4 py-2.5 text-left font-semibold">Active</th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((s) => (
                    <tr key={s.id} className={`hover:bg-gray-50 ${!s.active ? "opacity-50" : ""}`}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          {s.logoUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.logoUrl} alt={s.name} className="h-6 w-auto object-contain" />
                          )}
                          <span className="font-semibold">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-muted">
                        {s.website ? (
                          <a href={s.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand underline">
                            {s.website.replace(/^https?:\/\//, "")}
                          </a>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-muted">{s.sortOrder}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => handleToggleActive(s.id, s.active)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                        >
                          {s.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => handleDelete(s.id, s.name)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </>
  );
}
