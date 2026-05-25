import cdsapi
import json
import os
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

if not os.path.exists("public/data/era5_precipitation_raw.nc"):
    c = cdsapi.Client()
    c.retrieve(
        "reanalysis-era5-single-levels-monthly-means",
        {
            "product_type": "monthly_averaged_reanalysis",
            "variable": "total_precipitation",
            "year": [str(y) for y in range(1940, 2025)],
            "month": [f"{m:02d}" for m in range(1, 13)],
            "time": "00:00",
            "area": [71, 4, 57, 31],
            "format": "netcdf",
        },
        "public/data/era5_precipitation_raw.nc",
    )

with xr.open_dataset("public/data/era5_precipitation_raw.nc") as ds:
    tp = ds["tp"]

    days_in_month = tp.valid_time.dt.days_in_month
    monthly_mm = tp * days_in_month * 1000
    annual = monthly_mm.groupby("valid_time.year").sum(dim="valid_time")

    years = annual.year.values.tolist()
    lats = annual.latitude.values.tolist()
    lons = annual.longitude.values.tolist()

    if len(lats) < 2 or len(lons) < 2:
        raise ValueError(f"Need at least 2 lat and lon values, got {len(lats)} lats, {len(lons)} lons")

    half_lat = abs(lats[1] - lats[0]) / 2
    half_lon = abs(lons[1] - lons[0]) / 2

    cells = []
    for i, lat in enumerate(lats):
        for j, lon in enumerate(lons):
            cell_box = box(lon - half_lon, lat - half_lat, lon + half_lon, lat + half_lat)
            clipped = norway_shape.intersection(cell_box)
            if clipped.is_empty or clipped.geom_type not in ("Polygon", "MultiPolygon"):
                continue
            cell_data = annual.isel(latitude=i, longitude=j).values
            totals = [
                round(float(v), 1) if not np.isnan(v) else None
                for v in cell_data
            ]
            cells.append({
                "lat": round(float(lat), 2),
                "lon": round(float(lon), 2),
                "geometry": mapping(clipped),
                "data": totals,
            })

out = {"years": [int(y) for y in years], "cells": cells}

with open("public/data/precipitation-norway.json", "w") as f:
    json.dump(out, f, separators=(",", ":"))

print(f"Done: {len(years)} years, {len(cells)} cells")
