import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { routing } from "@/i18n/routing";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { MapClient } from "@/components/map/MapClient";
import { Suspense } from "react";
import { MapSkeleton } from "@/components/map/MapSkeleton";

type Props = {
  children: React.ReactNode;
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
            <Suspense name="map" fallback={ <MapSkeleton /> }>
              <MapClient />
            </Suspense>
            <div className="absolute top-2 left-2 z-30">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger variant="secondary" aria-label={t("toggleSidebar")} />
                </TooltipTrigger>
                <TooltipContent side="right">{t("toggleSidebar")}</TooltipContent>
              </Tooltip>
            </div>
            { children }
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </NextIntlClientProvider>
  );
}

export default LocaleLayout;