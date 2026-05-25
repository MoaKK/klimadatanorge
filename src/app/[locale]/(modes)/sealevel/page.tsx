import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SeaLevelMode } from "@/components/modes/sealevel/SeaLevelMode";

type Props = {
  params: Promise<{ locale: string }>;
};

async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <SeaLevelMode />;
}

export const revalidate = 86400;
export default Page;