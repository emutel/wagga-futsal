"use client";

import { useState } from "react";
import type { Competition } from "./CompetitionsClient";

type Props = {
  onCreated: (competition: Competition) => void;
};

export default function AddCompetitionForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    season: "",
    ageGroup: "OPENS",
    gender: "MIXED",
    status: "REGISTRATION",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/competitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create competition");
      return;
    }

    onCreated({ ...data, timeSlots: [], teams: [], _count: { fixtures: 0 } });
    setForm({ name: "", season: "", ageGroup: "OPENS", gender: "MIXED", status: "REGISTRATION" });
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark"
      >
        + Add Competition
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-5 mb-6">
      <h2 className="text-base font-bold text-navy mb-4">New Competition</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Winter Opens"
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Season</label>
          <input
            required
            value={form.season}
            onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))}
            placeholder="e.g. 2025-W1"
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Age Group</label>
          <select
            value={form.ageGroup}
            onChange={(e) => setForm((f) => ({ ...f, ageGroup: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {["U8", "U10", "U12", "U14", "U16", "U19", "OPENS", "SOCIAL"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Gender</label>
          <select
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="MIXED">Mixed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="REGISTRATION">Registration</option>
            <option value="ACTIVE">Active</option>
            <option value="FINALS">Finals</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Create Competition"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border border-border px-3 py-1.5 rounded text-sm hover:border-brand"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
