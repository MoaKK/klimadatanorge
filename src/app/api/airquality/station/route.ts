import { type NextRequest, NextResponse } from "next/server";

const AQ_BASE = "https://api.met.no/weatherapi/airqualityforecast/0.1";
const HEADERS = { "User-Agent": "klimadatanorge/1.0 github.com/MoaKK/klimakart" };

export async function GET(req: NextRequest) {
  const eoi = req.nextUrl.searchParams.get("eoi");
  if (!eoi) return NextResponse.json({ error: "Missing eoi" }, { status: 400 });
  const r = await fetch(`${AQ_BASE}/?station=${eoi}`, {
    headers: HEADERS,
    next: { revalidate: 3600 },
  });
  if (!r.ok) return NextResponse.json({ error: `HTTP ${r.status}` }, { status: r.status });
  return NextResponse.json(await r.json());
}