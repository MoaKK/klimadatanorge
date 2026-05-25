type CellGeometry =
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "MultiPolygon"; coordinates: number[][][][] };

type TemperatureCell = {
  lat: number;
  lon: number;
  geometry: CellGeometry;
  data: (number | null)[];
};

type TemperatureData = {
  years: number[];
  cells: TemperatureCell[];
};

export type { TemperatureCell, TemperatureData };