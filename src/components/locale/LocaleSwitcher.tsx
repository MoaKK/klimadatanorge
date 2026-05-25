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
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALE_CONFIG = {
  nb: { countryCode: "NO", label: "NO" },
  en: { countryCode: "GB", label: "EN" },
} satisfies Record<(typeof routing.locales)[number], { countryCode: string; label: string }>;

function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("locale");

  function switchLocale(locale: (typeof routing.locales)[number]) {
    router.replace(pathname, { locale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          title={ t("changeLanguage") }
          aria-label={ t("changeLanguage") }
          className="gap-1 w-full p-2 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto"
        >
          <Globe2Icon className="size-4 sm:size-5 shrink-0" aria-hidden="true" />
          <span className="group-data-[collapsible=icon]:hidden">{ t("changeLanguage") }</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        { routing.locales.map((locale) => {
          const { countryCode, label } = LOCALE_CONFIG[locale];
          return (
            <DropdownMenuItem
              key={ locale }
              onSelect={ () => switchLocale(locale) }
              className="flex cursor-pointer items-center gap-2"
              title={ t("switchTo", { locale: t(locale) }) }
            >
              <ReactCountryFlag
                countryCode={ countryCode }
                svg
                style={ {
                  width: "clamp(0.875rem, 2vw, 1.25rem)",
                  height: "clamp(0.875rem, 2vw, 1.25rem)",
                } }
                aria-hidden="true"
              />
              { label }
            </DropdownMenuItem>
          );
        }) }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { LocaleSwitcher };