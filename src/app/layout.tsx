import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Klima Data Norge",
  description: "Interactive climate maps for Norway - CO₂, temperature, sea level, precipitation, glaciers, and air quality.",
};

async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

export default RootLayout;
