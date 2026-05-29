import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import RulesViewer from "./RulesViewer";
import type { Section } from "./RulesViewer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Competition Rules" };

function parseSections(md: string): Section[] {
  const lines = md.split("\n");
  const sections: Section[] = [];
  let title = "";
  let buf: string[] = [];
  let idx = 0;

  for (const line of lines) {
    if (/^## /.test(line)) {
      if (title) sections.push({ title, content: buf.join("\n").trim(), index: idx++ });
      title = line.replace(/^## /, "").trim();
      buf = [];
    } else {
      buf.push(line);
    }
  }
  if (title) sections.push({ title, content: buf.join("\n").trim(), index: idx });
  return sections;
}

export default async function RulesPage() {
  const doc = await prisma.rulesDocument.findFirst({
    where: { active: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">FOOTBALL WAGGA WAGGA</p>
          <h1 className="text-4xl font-black text-navy leading-tight">Competition Rules</h1>
          {doc && (
            <p className="text-muted text-sm mt-2">
              Version {doc.version} &middot; Updated{" "}
              {new Date(doc.publishedAt).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        <a
          href="/api/rules/pdf"
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Download PDF
        </a>
      </div>

      {doc ? (
        <RulesViewer
          sections={parseSections(doc.content)}
          version={doc.version}
          publishedAt={doc.publishedAt.toISOString()}
        />
      ) : (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-navy font-semibold">Rules not yet published</p>
          <p className="text-muted text-sm mt-1">Check back soon.</p>
        </div>
      )}
    </div>
  );
}
