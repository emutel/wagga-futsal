"use client";

import { useState } from "react";
import EditRulesForm from "./EditRulesForm";

type RulesDocument = {
  id: string;
  title: string;
  content: string;
  version: string;
  publishedAt: string;
  active: boolean;
};

export default function RulesClient({ initialDoc }: { initialDoc: RulesDocument | null }) {
  const [doc, setDoc] = useState<RulesDocument | null>(initialDoc);

  return (
    <div>
      {doc && (
        <div className="bg-white border border-border rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-bold text-navy">{doc.title}</h2>
            <span className="text-xs text-muted">v{doc.version}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
          </div>
          <p className="text-xs text-muted">
            Published {new Date(doc.publishedAt).toLocaleDateString("en-AU", { dateStyle: "long" })}
          </p>
          <div className="mt-3 max-h-48 overflow-y-auto">
            <pre className="text-xs text-muted whitespace-pre-wrap font-mono bg-gray-50 rounded p-3">
              {doc.content.slice(0, 1000)}{doc.content.length > 1000 ? "\n…" : ""}
            </pre>
          </div>
        </div>
      )}

      <EditRulesForm currentDoc={doc} onSaved={setDoc} />
    </div>
  );
}
