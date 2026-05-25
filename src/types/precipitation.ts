type PrecipitationCell = {
  geometry: GeoJSON.Geometry;
  data: (number | null)[];
};

type PrecipitationData = {
  years: number[];
  cells: PrecipitationCell[];
};

export type { PrecipitationData, PrecipitationCell };
