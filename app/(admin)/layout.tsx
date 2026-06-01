import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/referee/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
