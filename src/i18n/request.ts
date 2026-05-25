import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import nbMessages from "../../messages/nb.json";
import enMessages from "../../messages/en.json";

const allMessages = {
  nb: nbMessages,
  en: enMessages,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const typedLocale = locale as (typeof routing.locales)[number];
  return {
    locale: typedLocale,
    messages: allMessages[typedLocale],
  };
});