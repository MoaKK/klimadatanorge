import { PrecipitationMode } from "@/components/modes/precipitation/PrecipitationMode";
import type { PrecipitationData } from "@/types/precipitation";

async function PrecipitationPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/data/precipitation-norway.json`,
    { next: { revalidate: 86400 } }
  );
  const data: PrecipitationData = await res.json();

  return <PrecipitationMode data={data} />;
}

export default PrecipitationPage;