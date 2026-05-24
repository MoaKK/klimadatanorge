import { setRequestLocale } from "next-intl/server";
import { MapClient } from "@/components/map/MapClient";

type Props = {
  params: Promise<{ locale: string }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MapClient />;
};

export default Page;
