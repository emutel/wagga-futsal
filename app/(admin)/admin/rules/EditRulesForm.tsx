"use client";

import { useState } from "react";

type RulesDocument = {
  id: string;
  title: string;
  content: string;
  version: string;
  publishedAt: string;
  active: boolean;
};

type Props = {
  currentDoc: RulesDocument | null;
  onSaved: (doc: RulesDocument) => void;
};

export default function EditRulesForm({ currentDoc, onSaved }: Props) {
  const [form, setForm] = useState({
    title: currentDoc?.title ?? "FOOTBALL WAGGA Rules",
    content: currentDoc?.content ?? "",
    version: currentDoc?.version ?? "1.0",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    const res = await fetch("/api/admin/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Failed to save rules"); return; }
    onSaved(data);
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border rounded-xl p-5">
      <h2 className="text-base font-bold text-navy mb-4">
        {currentDoc ? "Edit Rules Document" : "Create Rules Document"}
      </h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {success && (
        <p className="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-sm mb-3">
          Rules document saved successfully. A new version has been published.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Version</label>
          <input required value={form.version} onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
            placeholder="e.g. 2.1"
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted mb-1">
          Content <span className="font-normal text-muted">(Markdown supported)</span>
        </label>
        <textarea
          required
          rows={24}
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          className="border border-border rounded-lg px-3 py-2 text-sm w-full font-mono focus:outline-none focus:ring-2 focus:ring-brand resize-y"
          placeholder="# Rules&#10;&#10;## Section 1&#10;..."
        />
      </div>

      <div className="flex items-center justify-between">
        <button type="submit" disabled={saving}
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-dark disabled:opacity-60">
          {saving ? "Saving…" : "Save & Publish"}
        </button>
        {currentDoc && (
          <p className="text-xs text-muted">
            Current: v{currentDoc.version} · published {new Date(currentDoc.publishedAt).toLocaleDateString("en-AU")}
          </p>
        )}
      </div>
    </form>
  );
}
