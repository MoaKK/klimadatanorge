import type { Projections } from "@/types/sealevel";

const YEARS = [2020, 2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];
const MIN_YEAR = YEARS[0];
const MAX_YEAR = YEARS[YEARS.length - 1];

// Additional sea level rise in meters above 2020 conditions
// Source: IPCC AR6 WG1 Chapter 9 median estimates, rebased to 2020
const PROJECTIONS: Projections = {
  low:    [0.00, 0.08, 0.12, 0.16, 0.19, 0.21, 0.23, 0.25, 0.26],
  medium: [0.00, 0.09, 0.15, 0.22, 0.28, 0.34, 0.40, 0.43, 0.45],
  high:   [0.00, 0.10, 0.18, 0.26, 0.38, 0.52, 0.70, 0.83, 0.95],
};

export { PROJECTIONS, YEARS, MIN_YEAR, MAX_YEAR };