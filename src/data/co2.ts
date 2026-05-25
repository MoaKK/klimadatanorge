import type { Co2Record } from "@/types/co2";
import rawData from "../../public/data/co2-norway.json";

const co2Data = rawData as Co2Record[];

const MIN_YEAR = co2Data.reduce((min, r) => (r.year < min ? r.year : min), Infinity);
const MAX_YEAR = co2Data.reduce((max, r) => (r.year > max ? r.year : max), -Infinity);

export { co2Data, MIN_YEAR, MAX_YEAR };