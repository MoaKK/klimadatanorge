import json
import numpy as np
import xarray as xr
from shapely.geometry import box, shape, mapping
from shapely.ops import unary_union

with open("public/data/norway.json") as f:
    norway_geojson = json.load(f)

norway_shape = unary_union([
    shape(feature["geometry"])
    for feature in norway_geojson["features"]
])

ds = xr.open_dataset("public/data/gistemp1200_GHCNv4_ERSSTv5.nc")

norway = ds["tempanomaly"].sel(
    lat=slice(57, 71),
    lon=slice(4, 31),
)

annual = norway.groupby("time.year").mean(dim="time")

years = annual.year.values.tolist()
lats = annual.lat.values.tolist()
lons = annual.lon.values.tolist()

half_lat = (lats[1] - lats[0]) / 2
half_lon = (lons[1] - lons[0]) / 2

cells = []
for i, lat in enumerate(lats):
    for j, lon in enumerate(lons):
        cell_box = box(lon - half_lon, lat - half_lat, lon + half_lon, lat + half_lat)
        clipped = norway_shape.intersection(cell_box)
        if clipped.is_empty or clipped.geom_type not in ("Polygon", "MultiPolygon"):
            continue
        cell_data = annual.isel(lat=i, lon=j).values
        anomalies = [
            round(float(v), 2) if not np.isnan(v) else None
            for v in cell_data
        ]
        cells.append({
            "lat": round(float(lat), 1),
            "lon": round(float(lon), 1),
            "geometry": mapping(clipped),
            "data": anomalies,
        })

out = {"years": [int(y) for y in years], "cells": cells}

with open("public/data/temperature-norway.json", "w") as f:
    json.dump(out, f, separators=(",", ":"))

print(f"Done: {len(years)} years, {len(cells)} cells")