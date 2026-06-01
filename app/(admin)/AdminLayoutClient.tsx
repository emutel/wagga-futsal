"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/referee/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/competitions", label: "Competitions", icon: "🏆" },
  { href: "/admin/teams", label: "Teams", icon: "👥" },
  { href: "/admin/players", label: "Players", icon: "⚽" },
  { href: "/admin/fixtures", label: "Fixtures", icon: "📅" },
  { href: "/admin/referees", label: "Referees", icon: "🟨" },
  { href: "/admin/sessions", label: "Sessions", icon: "🎟️" },
  { href: "/admin/payroll", label: "Payroll", icon: "💰" },
  { href: "/admin/sponsors", label: "Sponsors", icon: "⭐" },
  { href: "/admin/rules", label: "Rules", icon: "📋" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const activeLabel =
    NAV.find((n) => (n.href !== "/admin" && pathname.startsWith(n.href)) || pathname === n.href)?.label ?? "Admin";

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-56 bg-navy text-white flex flex-col shrink-0 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="FOOTBALL WAGGA" width={32} height={32} className="rounded shrink-0" />
            <div>
              <p className="text-white font-black text-xs leading-tight">FOOTBALL WAGGA</p>
              <p className="text-white/40 text-xs">Admin</p>
            </div>
          </div>
          <button
            className="lg:hidden text-white/60 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map((n) => {
            const isActive =
              pathname === n.href ||
              (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base leading-none shrink-0">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-navy text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/80 hover:text-white p-1 -ml-1 shrink-0"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Image src="/logo.png" alt="FOOTBALL WAGGA" width={28} height={28} className="rounded shrink-0" />
          <span className="font-black text-sm truncate">{activeLabel}</span>
        </div>

        <main className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
