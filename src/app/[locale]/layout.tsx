import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { routing } from "@/i18n/routing";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { ReactNode } from "react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://klimadatanorge.no";

  const isNb = locale === "nb";
  const title = isNb ? "Klima Data Norge" : "Climate Data Norway";
  const description = isNb
    ? "Interaktive kart over klimadata for Norge - CO₂-utslipp, temperaturavvik, havnivåstigning og nedbør."
    : "Interactive maps of climate data for Norway - CO₂ emissions, temperature anomaly, sea level rise, and precipitation.";

  return {
    title: { default: title, template: `%s | ${title}` },
    description,
    metadataBase: new URL(base),
    alternates: {
      canonical: `/${locale}`,
      languages: { nb: "/nb", en: "/en" },
    },
    openGraph: {
      title,
      description,
      url: `${base}/${locale}`,
      siteName: "Klima Data Norge",
      locale: isNb ? "nb_NO" : "en_US",
      type: "website",
    },
  };
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations("ui");

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="relative overflow-hidden">
            <div className="absolute top-2 left-2 z-30">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger variant="secondary" aria-label={t("toggleSidebar")} className="[&_svg]:!size-5 sm:[&_svg]:!size-6 size-9 sm:size-10 "/>
                </TooltipTrigger>
                <TooltipContent side="right">{t("toggleSidebar")}</TooltipContent>
              </Tooltip>
            </div>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </NextIntlClientProvider>
  );
}

export default LocaleLayout;