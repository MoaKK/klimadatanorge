import { PrecipitationMode } from "@/components/modes/precipitation/PrecipitationMode";
import type { PrecipitationData } from "@/types/precipitation";

async function PrecipitationPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(
    `${base}/data/precipitation-norway.json`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error(`Failed to fetch precipitation data: ${res.status}`);
  const data: PrecipitationData = await res.json();

  return <PrecipitationMode data={data} />;
}

export default PrecipitationPage;