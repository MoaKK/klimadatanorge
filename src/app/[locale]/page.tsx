import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { VantaGlobeClient } from "@/components/home/VantaGlobeClient";
import { AboutPanel } from "@/components/home/AboutPanel";

type Props = {
  params: Promise<{ locale: string }>;
};

async function Page({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      <VantaGlobeClient />
      <AboutPanel />
    </>
  );
}

export default Page;