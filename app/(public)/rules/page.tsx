import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Competition Rules" };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function extractHeadings(md: string) {
  return md
    .split("\n")
    .filter((l) => /^## /.test(l))
    .map((l) => {
      const text = l.replace(/^## /, "").trim();
      return { text, id: slugify(text) };
    });
}

const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-black text-navy mt-10 mb-4 pb-2 border-b-2 border-brand/20">{children}</h1>
  ),
  h2: ({ children }) => {
    const id = slugify(String(children));
    return (
      <h2 id={id} className="group flex items-center gap-2 text-xl font-black text-navy mt-10 mb-3 scroll-mt-6">
        <span className="w-1 h-6 bg-brand rounded-full shrink-0" />
        {children}
        <a href={`#${id}`} className="opacity-0 group-hover:opacity-40 text-navy text-sm font-normal">#</a>
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="text-base font-bold text-navy mt-6 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 pl-5 space-y-1 list-disc marker:text-brand">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 pl-5 space-y-1 list-decimal marker:text-brand">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-700 leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-navy">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand bg-brand/5 px-4 py-3 rounded-r-lg my-4 text-gray-700 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-border rounded-lg overflow-hidden">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-navy text-white">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-t border-border">{children}</td>
  ),
  hr: () => <hr className="my-8 border-border" />,
};


export default async function RulesPage() {
  const doc = await prisma.rulesDocument.findFirst({
    where: { active: true },
    orderBy: { publishedAt: "desc" },
  });

  const headings = doc ? extractHeadings(doc.content) : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-brand text-xs font-bold uppercase tracking-widest mb-1">Wagga Futsal</p>
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
        <div className="flex gap-10 items-start">
          {/* Sticky ToC sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-56 shrink-0 sticky top-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Contents</p>
              <nav className="space-y-0.5">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="block text-sm text-gray-600 hover:text-brand py-1 px-2 rounded hover:bg-brand/5 transition-colors leading-tight"
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          {/* Rules content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white border border-border rounded-2xl px-8 py-8 shadow-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {doc.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-navy font-semibold">Rules not yet published</p>
          <p className="text-muted text-sm mt-1">Check back soon.</p>
        </div>
      )}
    </div>
  );
}
