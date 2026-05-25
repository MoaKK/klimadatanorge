# Klimakart

Klimakart visualises climate data on an interactive map.

## Modes

| Mode | Coverage | Data source |
|---|---|---|
| CO2 Emissions | Norway | Statistics Norway (SSB) |
| Temperature Anomaly | Norway | NASA GISS Surface Temperature Analysis |
| Sea Level Rise | Global | IPCC AR6 WG1 Chapter 9, Terrarium elevation tiles |

## Stack

- **Framework:** Next.js 15 (App Router)
- **Map:** MapLibre GL JS 5
- **Charts:** D3
- **UI:** shadcn/ui, Tailwind CSS
- **i18n:** next-intl (Norwegian and English)
- **Language:** TypeScript

## Running locally

```bash
npm install
npm run dev
