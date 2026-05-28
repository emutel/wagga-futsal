"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/referee/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-white/60 hover:text-white border border-white/20 px-2 py-1 rounded transition-colors"
    >
      Logout
    </button>
  );
}
