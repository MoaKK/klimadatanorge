import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { precipitationData } from "@/data/precipitation";
import { PrecipitationMode } from "@/components/modes/precipitation/PrecipitationMode";

type Props = {
  params: Promise<{ locale: string }>;
};

async function PrecipitationPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <PrecipitationMode data={precipitationData} />;
}

export const revalidate = 86400;

export default PrecipitationPage;
