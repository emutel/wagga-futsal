import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/referee/LogoutButton";

export default async function RefereeProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/referee/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-2 min-w-0">
          <Image src="/logo.png" alt="FOOTBALL WAGGA" width={32} height={32} className="rounded shrink-0" />
          <div className="min-w-0">
            <p className="font-black text-white text-xs leading-tight">FOOTBALL WAGGA</p>
            <p className="text-white/60 text-xs">Referee Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-white/70 hidden sm:block truncate max-w-32">{session.user.name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
