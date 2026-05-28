"use client";

import { Fragment, useState } from "react";

type TeamRef = { id: string; name: string };
type PitchRef = { id: string; name: string };
type RefereeUser = { id: string; name: string };
type RefereeRef = { id: string; user: RefereeUser };

type Fixture = {
  id: string;
  round: number;
  phase: string;
  status: string;
  scheduledAt: string;
  homeScore: number;
  awayScore: number;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  pitch: PitchRef | null;
  fieldReferee: RefereeRef | null;
  scorer: RefereeRef | null;
};

type Referee = { id: string; user: { name: string } };
type Pitch = { id: string; name: string; venue: { name: string } };

const STATUS_COLOURS: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  FORFEITED_HOME: "bg-red-100 text-red-700",
  FORFEITED_AWAY: "bg-red-100 text-red-700",
  ABANDONED: "bg-orange-100 text-orange-700",
};

export default function FixtureRow({
  fixture,
  referees,
  pitches,
  onUpdated,
}: {
  fixture: Fixture;
  referees: Referee[];
  pitches: Pitch[];
  onUpdated: (f: Fixture) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    scheduledAt: fixture.scheduledAt ? new Date(fixture.scheduledAt).toISOString().slice(0, 16) : "",
    pitchId: fixture.pitch?.id ?? "",
    fieldRefereeId: fixture.fieldReferee?.id ?? "",
    scorerId: fixture.scorer?.id ?? "",
    status: fixture.status,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/fixtures/${fixture.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scheduledAt: form.scheduledAt || null,
        pitchId: form.pitchId || null,
        fieldRefereeId: form.fieldRefereeId || null,
        scorerId: form.scorerId || null,
        status: form.status,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      onUpdated(data);
      setEditing(false);
    }
  };

  return (
    <Fragment>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2.5 text-muted text-xs font-mono">{fixture.round}</td>
        <td className="px-4 py-2.5">
          <span className="font-semibold text-navy text-sm">{fixture.homeTeam.name}</span>
          <span className="text-muted mx-1">vs</span>
          <span className="font-semibold text-navy text-sm">{fixture.awayTeam.name}</span>
          {fixture.status === "COMPLETED" && (
            <span className="ml-2 text-xs text-muted font-mono">{fixture.homeScore}–{fixture.awayScore}</span>
          )}
        </td>
        <td className="px-4 py-2.5 text-xs text-muted">
          {fixture.scheduledAt
            ? new Date(fixture.scheduledAt).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" })
            : "—"}
        </td>
        <td className="px-4 py-2.5 text-xs text-muted">{fixture.pitch?.name ?? "—"}</td>
        <td className="px-4 py-2.5 text-xs text-muted">
          {fixture.fieldReferee?.user.name ?? "—"} / {fixture.scorer?.user.name ?? "—"}
        </td>
        <td className="px-4 py-2.5">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOURS[fixture.status] ?? "bg-gray-100"}`}>
            {fixture.status.replace(/_/g, " ")}
          </span>
        </td>
        <td className="px-4 py-2.5">
          <button
            onClick={() => setEditing((v) => !v)}
            className="border border-border px-3 py-1.5 rounded text-sm hover:border-brand"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </td>
      </tr>

      {editing && (
        <tr className="bg-gray-50 border-t border-border">
          <td colSpan={7} className="px-4 py-3">
            <form onSubmit={handleSave} className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-muted mb-0.5">Date/Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-0.5">Pitch</label>
                <select
                  value={form.pitchId}
                  onChange={(e) => setForm((f) => ({ ...f, pitchId: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="">— None —</option>
                  {pitches.map((p) => (
                    <option key={p.id} value={p.id}>{p.venue.name} – {p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-0.5">Field Referee</label>
                <select
                  value={form.fieldRefereeId}
                  onChange={(e) => setForm((f) => ({ ...f, fieldRefereeId: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="">— None —</option>
                  {referees.map((r) => (
                    <option key={r.id} value={r.id}>{r.user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-0.5">Scorer</label>
                <select
                  value={form.scorerId}
                  onChange={(e) => setForm((f) => ({ ...f, scorerId: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="">— None —</option>
                  {referees.map((r) => (
                    <option key={r.id} value={r.id}>{r.user.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-0.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="border border-border rounded px-2 py-1.5 text-xs focus:outline-none"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="LIVE">Live</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="FORFEITED_HOME">Forfeited (Home)</option>
                  <option value="FORFEITED_AWAY">Forfeited (Away)</option>
                  <option value="ABANDONED">Abandoned</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-brand text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-brand-dark disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </form>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
