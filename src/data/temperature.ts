import type { TemperatureData } from "@/types/temperature";
import rawData from "../../public/data/temperature-norway.json";

const temperatureData = rawData as unknown as TemperatureData;

const MIN_YEAR = temperatureData.years[0];
const MAX_YEAR = temperatureData.years[temperatureData.years.length - 1];

export { temperatureData, MIN_YEAR, MAX_YEAR };