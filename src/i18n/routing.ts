import { defineRouting } from "next-intl/routing";

const routing = defineRouting({
  locales: ["nb", "en"],
  defaultLocale: "nb",
});

export { routing };
