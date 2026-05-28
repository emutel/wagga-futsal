import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Competition Rules" };

export default async function RulesPage() {
  const doc = await prisma.rulesDocument.findFirst({
    where: { active: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-navy">Competition Rules</h1>
          {doc && (
            <p className="text-muted text-sm mt-1">
              Version {doc.version} · Updated{" "}
              {new Date(doc.publishedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
        <a
          href="/api/rules/pdf"
          className="text-sm bg-brand text-white px-3 py-1.5 rounded font-semibold hover:bg-brand-dark transition-colors"
        >
          Download PDF
        </a>
      </div>

      {doc ? (
        <div
          className="prose prose-navy max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.content) }}
        />
      ) : (
        <div className="bg-white border border-border rounded-xl p-8 text-center">
          <p className="text-muted">Rules document not yet published. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

// Very basic markdown renderer — headings, bold, lists
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold text-navy mt-6 mb-2'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-xl font-black text-navy mt-8 mb-3'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-black text-navy mt-8 mb-4'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li class='ml-4 list-decimal'>$2</li>")
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/^(?!<[h|l])(.+)$/gm, "<p class='mb-3'>$1</p>");
}
