import type { PrecipitationData } from "@/types/precipitation";
import rawData from "../../public/data/precipitation-norway.json";

const precipitationData = rawData as unknown as PrecipitationData;

const MIN_YEAR = 1940;
const MAX_YEAR = 2024;

export { precipitationData, MIN_YEAR, MAX_YEAR };
