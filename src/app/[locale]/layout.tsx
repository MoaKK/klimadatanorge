import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { routing } from "@/i18n/routing";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { MapClient } from "@/components/map/MapClient";

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="relative h-screen overflow-hidden">
            <MapClient />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </NextIntlClientProvider>
  );
}

export default LocaleLayout;