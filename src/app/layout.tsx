import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Klimakart",
  description: "Norwegian climate change interactive map",
};

async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={cn("font-sans dark", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;