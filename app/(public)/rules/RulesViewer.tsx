"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export type Section = { title: string; content: string; index: number };

const mdComponents: Components = {
  h1: ({ children }) => <h1 className="text-lg font-black text-navy mt-6 mb-3">{children}</h1>,
  h3: ({ children }) => <h3 className="text-sm font-bold text-navy mt-5 mb-1.5 uppercase tracking-wide">{children}</h3>,
  p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3 text-sm">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 pl-5 space-y-1.5 list-disc marker:text-brand">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 pl-5 space-y-1.5 list-decimal marker:text-brand">{children}</ol>,
  li: ({ children }) => <li className="text-gray-700 text-sm leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-navy">{children}</strong>,
  blockquote: ({ children }) => (
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 my-4">
      <span className="text-amber-500 text-lg shrink-0">⚠</span>
      <div className="text-amber-900 text-sm">{children}</div>
    </div>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-xl border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-navy text-white">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-xs uppercase tracking-wide">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2 border-t border-border text-gray-700">{children}</td>,
  hr: () => <hr className="my-5 border-border" />,
};

const ICONS: [RegExp, string][] = [
  [/player|eligib|registr/i, "👤"],
  [/match|game|kick.?off|start/i, "⚽"],
  [/foul|card|misconduct|discipline|suspend/i, "🟨"],
  [/goal|scoring|score/i, "🥅"],
  [/time|half|duration|period/i, "⏱"],
  [/uniform|kit|equipment|footwear|apparel/i, "👕"],
  [/referee|official/i, "🦺"],
  [/pitch|field|court|dimension/i, "📐"],
  [/protest|appeal|complaint/i, "📋"],
  [/ball/i, "🔵"],
];

function iconFor(title: string) {
  for (const [re, icon] of ICONS) if (re.test(title)) return icon;
  return "📌";
}

export default function RulesViewer({ sections, version, publishedAt }: {
  sections: Section[];
  version: string;
  publishedAt: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const filtered = useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
    );
  }, [sections, query]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const expandAll = () => setOpen(new Set(filtered.map((s) => s.index)));
  const collapseAll = () => setOpen(new Set());

  return (
    <div>
      {/* Search + controls */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search rules…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(new Set(filtered.map((s) => s.index))); }}
            className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-white"
          />
        </div>
        <button onClick={expandAll} className="text-xs text-muted hover:text-navy px-3 py-2 border border-border rounded-xl hover:border-navy transition-colors whitespace-nowrap">
          Expand all
        </button>
        <button onClick={collapseAll} className="text-xs text-muted hover:text-navy px-3 py-2 border border-border rounded-xl hover:border-navy transition-colors whitespace-nowrap">
          Collapse
        </button>
      </div>

      {/* Section pills */}
      {!query && (
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((s) => (
            <button
              key={s.index}
              onClick={() => { setOpen((prev) => new Set([...prev, s.index])); setTimeout(() => document.getElementById(`section-${s.index}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white border border-border rounded-full px-3 py-1.5 hover:border-brand hover:text-brand transition-colors"
            >
              <span>{iconFor(s.title)}</span>
              {s.title}
            </button>
          ))}
        </div>
      )}

      {/* Accordion */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted text-sm">No rules match &ldquo;{query}&rdquo;</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isOpen = open.has(s.index);
            return (
              <div
                key={s.index}
                id={`section-${s.index}`}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${isOpen ? "border-brand/30" : "border-border"}`}
              >
                <button
                  onClick={() => toggle(s.index)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left group"
                >
                  <span className="text-2xl w-8 shrink-0">{iconFor(s.title)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand uppercase tracking-widest">
                        {String(s.index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="font-black text-navy text-base leading-tight">{s.title}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-border/60">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {s.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-muted mt-10">
        Version {version} · Published {new Date(publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
