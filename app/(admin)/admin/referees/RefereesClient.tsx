"use client";

import { useState } from "react";
import AddRefereeForm from "./AddRefereeForm";

type Referee = {
  id: string;
  phone: string | null;
  user: { id: string; name: string; email: string; role: string };
  _count: { fieldRefGames: number };
};

export default function RefereesClient({ initialReferees }: { initialReferees: Referee[] }) {
  const [referees, setReferees] = useState<Referee[]>(initialReferees);

  const handleCreated = (r: Referee) => setReferees((prev) => [...prev, r]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove referee "${name}"? This will delete their login account.`)) return;
    await fetch(`/api/admin/referees/${id}`, { method: "DELETE" });
    setReferees((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      <div className="mb-6">
        <AddRefereeForm onCreated={handleCreated} />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Games</th>
              <th className="px-4 py-3 text-left font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {referees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-8">No referees yet.</td>
              </tr>
            ) : (
              referees.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-semibold">{r.user.name}</td>
                  <td className="px-4 py-2.5 text-muted">{r.user.email}</td>
                  <td className="px-4 py-2.5 text-muted">{r.phone ?? "—"}</td>
                  <td className="px-4 py-2.5 text-muted">{r._count.fieldRefGames}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleDelete(r.id, r.user.name)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
