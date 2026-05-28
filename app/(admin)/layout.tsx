import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import LogoutButton from "@/components/referee/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/competitions", label: "Competitions" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/players", label: "Players" },
  { href: "/admin/fixtures", label: "Fixtures" },
  { href: "/admin/referees", label: "Referees" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/sponsors", label: "Sponsors" },
  { href: "/admin/rules", label: "Rules" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/referee/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-navy text-white flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-white/10 flex items-center gap-3">
          <Image src="/logo.png" alt="Wagga Futsal" width={36} height={36} className="rounded shrink-0" />
          <div>
            <p className="text-white font-black text-sm leading-tight">WAGGA FUTSAL</p>
            <p className="text-white/40 text-xs">Admin</p>
          </div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gray-50 min-h-screen overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
