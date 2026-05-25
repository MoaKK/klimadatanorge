# Klimakart

Klimakart visualises climate data for Norway on an interactive map.

## Modes

| Mode | Coverage | Data source |
|---|---|---|
| CO₂ Emissions | Norway | Our World in Data |
| Temperature Anomaly | Norway | NASA GISS Surface Temperature Analysis (GISTEMP v4) |
| Sea Level Rise | Global | IPCC AR6 WG1, Terrarium elevation tiles |
| Precipitation | Norway | ERA5 / Copernicus Climate Data Store |

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Map:** MapLibre GL JS 5, OpenFreeMap basemap
- **Charts:** D3
- **UI:** shadcn/ui, Tailwind CSS v4
- **i18n:** next-intl (Norwegian bokmål and English)
- **Homepage:** Vanta.js globe (Three.js)

## Running locally

```bash
npm install
npm run dev
```

## Data preprocessing

Climate data is preprocessed into static JSON files under `public/data/` using Python scripts in `preprocessing/`. These are one-time scripts and do not need to be re-run unless the source data changes.

```bash
cd preprocessing
pip install cdsapi xarray numpy shapely
python preprocess_precipitation.py  # requires ~/.cdsapirc with Copernicus CDS credentials
```

Temperature and CO₂ data are bundled from their respective sources and preprocessed similarly.
