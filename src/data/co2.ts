import type { Co2Record } from "@/types/co2";
import rawData from "../../public/data/co2-norway.json";

const co2Data = rawData as Co2Record[];

const MIN_YEAR = Math.min(...co2Data.map((r) => r.year));
const MAX_YEAR = Math.max(...co2Data.map((r) => r.year));

export { co2Data, MIN_YEAR, MAX_YEAR };