"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locale");

  const nextLocale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const switchLocale = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button variant="default" size="sm" onClick={switchLocale}>
      {t(nextLocale)}
    </Button>
  );
};

export { LocaleSwitcher };
