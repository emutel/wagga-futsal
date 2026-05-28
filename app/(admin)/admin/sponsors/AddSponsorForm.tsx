"use client";

import { useState } from "react";

type Sponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string | null;
  tier: string;
  active: boolean;
  sortOrder: number;
};

type Props = { onCreated: (sponsor: Sponsor) => void };

export default function AddSponsorForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    website: "",
    tier: "BRONZE",
    sortOrder: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/sponsors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        logoUrl: form.logoUrl || null,
        website: form.website || null,
        tier: form.tier,
        sortOrder: Number(form.sortOrder),
        active: true,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed to create sponsor"); return; }
    onCreated(data);
    setForm({ name: "", logoUrl: "", website: "", tier: "BRONZE", sortOrder: "0" });
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark">
        + Add Sponsor
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-5 mb-6">
      <h2 className="text-base font-bold text-navy mb-4">New Sponsor</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Name</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Tier</label>
          <select value={form.tier} onChange={(e) => setForm((f) => ({ ...f, tier: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand">
            <option value="PLATINUM">Platinum</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="BRONZE">Bronze</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Logo URL</label>
          <input type="url" value={form.logoUrl} onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
            placeholder="https://…"
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Website</label>
          <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            placeholder="https://…"
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark disabled:opacity-60">
          {saving ? "Saving…" : "Create Sponsor"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="border border-border px-3 py-1.5 rounded text-sm hover:border-brand">Cancel</button>
      </div>
    </form>
  );
}
