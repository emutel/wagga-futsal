import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/referee/LogoutButton";

export default async function RefereeLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/referee/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-black text-brand text-sm">WAGGA FUTSAL</p>
          <p className="text-white/60 text-xs">Referee Portal</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/70">{session.user.name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
