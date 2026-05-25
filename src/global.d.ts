import { routing } from "@/i18n/routing";
import messages from "../messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}