import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { temperatureData, MIN_YEAR, MAX_YEAR } from "@/data/temperature";
import { TemperatureMode } from "@/components/modes/temperature/TemperatureMode";

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
    <TemperatureMode
      data={temperatureData}
      minYear={MIN_YEAR}
      maxYear={MAX_YEAR}
    />
  );
}

export const revalidate = 86400;

export default Page;