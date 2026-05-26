import { NextResponse } from "next/server";

const AQ_BASE = "https://api.met.no/weatherapi/airqualityforecast/0.1";
const HEADERS = { "User-Agent": "klimadatanorge/1.0 github.com/MoaKK/klimakart" };

export async function GET() {
  const r = await fetch(`${AQ_BASE}/stations`, {
    headers: HEADERS,
    next: { revalidate: 86400 },
  });
  if (!r.ok) return NextResponse.json({ error: `HTTP ${r.status}` }, { status: r.status });
  return NextResponse.json(await r.json());
}