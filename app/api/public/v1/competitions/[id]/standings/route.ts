import { getStandings } from "@/lib/standings";
import { publicJson, publicOptions, type ApiStandingRow } from "@/lib/publicApi";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export function OPTIONS() {
  return publicOptions();
}

// GET /api/public/v1/competitions/:id/standings
// The ladder, ordered points -> goal difference -> goals for.
export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const standings: ApiStandingRow[] = await getStandings(id);
  return publicJson({ standings });
}
