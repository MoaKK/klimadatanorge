# Klima Data Norge

Interactive maps of climate data for Norway.

## Modes

| Mode | Coverage | Data source |
|---|---|---|
| CO₂ Emissions | Norway | Our World in Data |
| Temperature Anomaly | Norway | NASA GISS Surface Temperature Analysis (GISTEMP v4) |
| Sea Level Rise | Global | IPCC AR6 WG1, Terrarium elevation tiles |
| Precipitation | Norway | ERA5 / Copernicus Climate Data Store |
| Glacier Retreat | Norway | NVE Norwegian Glacier Inventory |
| Air Quality | Norway | Norwegian Meteorological Institute (met.no) |

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Map:** MapLibre GL JS 5, OpenFreeMap basemap
- **Charts:** D3
- **UI:** shadcn/ui, Tailwind CSS v4
- **Data fetching:** TanStack Query
- **i18n:** next-intl (Norwegian bokmål and English)

## Running locally

```bash
npm install
npm run dev
```
