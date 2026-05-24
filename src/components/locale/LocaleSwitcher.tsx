"use client";

import { Globe2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import ReactCountryFlag from "react-country-flag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

const LOCALE_CONFIG = {
  nb: { countryCode: "NO", label: "NO" },
  en: { countryCode: "GB", label: "EN" },
} satisfies Record<(typeof routing.locales)[number], { countryCode: string; label: string }>;

const LocaleSwitcher = () => {
  const pathname = usePathname();
  const t = useTranslations("locale");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="icon"
          title={ t("changeLanguage") }
          aria-label={ t("changeLanguage") }
        >
          <Globe2Icon className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        { routing.locales.map((locale) => {
          const { countryCode, label } = LOCALE_CONFIG[locale];
          return (
            <DropdownMenuItem key={ locale } asChild>
              <Link
                href={ pathname }
                locale={ locale }
                className="flex cursor-pointer items-center gap-2"
                title={ t("switchTo", { locale: t(locale) }) }
              >
                <ReactCountryFlag
                  countryCode={ countryCode }
                  svg
                  style={ { width: "1rem", height: "1rem" } }
                  aria-hidden="true"
                />
                { label }
              </Link>
            </DropdownMenuItem>
          );
        }) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LocaleSwitcher };