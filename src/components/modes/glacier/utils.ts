import type { GlacierPeriod } from "@/types/glacier";

const SOURCE_ID = "glacier-outlines";
const FILL_ID = "glacier-fill";
const OUTLINE_ID = "glacier-outline";
const LABEL_SOURCE_ID = "glacier-label";
const LABEL_ID = "glacier-label-text";
const LABEL_LNGLAT: [number, number] = [10, 63];

const PERIODS: GlacierPeriod[] = [
  { key: "1947-1985", label: "1947-1985", totalArea: 3350.6, partial: false },
  { key: "1988-1997", label: "1988-1997", totalArea: 1723.1, partial: true },
  { key: "1999-2006", label: "1999-2006", totalArea: 2692.5, partial: true },
  { key: "2018-2019", label: "2018-2019", totalArea: 2328.5, partial: false },
];

export { SOURCE_ID, FILL_ID, OUTLINE_ID, LABEL_SOURCE_ID, LABEL_ID, LABEL_LNGLAT, PERIODS };