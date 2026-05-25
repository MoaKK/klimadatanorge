import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { co2Data, MIN_YEAR, MAX_YEAR } from "@/data/co2";
import { Co2Mode } from "@/components/modes/co2/Co2Mode";

type Props = {
  params: Promise<{ locale: string }>;
};

async function Page({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <Co2Mode data={co2Data} minYear={MIN_YEAR} maxYear={MAX_YEAR} />;
}

export default Page;