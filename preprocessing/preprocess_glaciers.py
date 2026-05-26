import geopandas as gpd
import os

DATASETS = [
    {
        "key": "1947-1985",
        "zip": "preprocessing/cryoclim_GAO_NO_1947_1985_UTM_33N.zip",
        "shp": "cryoclim_GAO_NO_1947_1985_lat_long.shp",
        "name_col": "brenavn",
        "area_col": "areal_km2",
    },
    {
        "key": "1988-1997",
        "zip": "preprocessing/cryoclim_GAO_NO_1988_1997_UTM_33N.zip",
        "shp": "cryoclim_GAO_NO_1988_1997_lat_long.shp",
        "name_col": "BRENAVN",
        "area_col": "AREAL_KM2",
    },
    {
        "key": "1999-2006",
        "zip": "preprocessing/cryoclim_GAO_NO_1999_2006_UTM_33N.zip",
        "shp": "cryoclim_GAO_NO_1999_2006_lat_long.shp",
        "name_col": "BRENAVN",
        "area_col": "AREAL_KM2",
    },
    {
        "key": "2018-2019",
        "zip": "preprocessing/GlacierAreaOutline_NO_2018_2019_N.zip",
        "shp": "GlacierAreaOutline_2018_2019_N.shp",
        "name_col": "brenavn",
        "area_col": "areal_km2",
    },
]

SIMPLIFY_TOLERANCE = 0.001

os.makedirs("public/data", exist_ok=True)

for ds in DATASETS:
    print(f"Processing {ds['key']}...")
    gdf = gpd.read_file(f"zip://{ds['zip']}!{ds['shp']}")

    if gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs(epsg=4326)

    gdf["geometry"] = gdf["geometry"].simplify(SIMPLIFY_TOLERANCE, preserve_topology=True)
    gdf = gdf[~gdf.geometry.is_empty & gdf.geometry.notna()]

    gdf_out = gdf[["geometry"]].copy()
    gdf_out["name"] = gdf[ds["name_col"]]
    gdf_out["area_km2"] = gdf[ds["area_col"]].round(3)

    out_path = f"public/data/glaciers-{ds['key']}.geojson"
    gdf_out.to_file(out_path, driver="GeoJSON")

    size = os.path.getsize(out_path)
    print(f"  -> {out_path}: {size / 1024 / 1024:.1f} MB, {len(gdf_out)} features")

print("Done!")