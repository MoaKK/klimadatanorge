import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klimakart",
  description: "Norwegian climate change interactive map",
};

async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="dark">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;