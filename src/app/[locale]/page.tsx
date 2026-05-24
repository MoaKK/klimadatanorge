import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MapClient } from "@/components/map/MapClient";
import { LocaleSwitcher } from "@/components/locale/LocaleSwitcher";

type Props = {
  params: Promise<{ locale: string }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="relative h-screen w-full">
      <MapClient />
      <div className="absolute top-4 right-4 z-10">
        <LocaleSwitcher />
      </div>
    </div>
  );
};

export default Page;