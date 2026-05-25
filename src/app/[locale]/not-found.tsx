import { getTranslations } from "next-intl/server";
import { MapPinOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinOff className="size-[clamp(2rem,5vw,3rem)]" />
          </EmptyMedia>
          <EmptyTitle className="text-sm sm:text-lg md:text-xl">{t("title")}</EmptyTitle>
          <EmptyDescription className="text-xs sm:text-sm md:text-base">{t("description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="justify-center">
          <Button variant="default" asChild>
            <Link href="/">{t("back")}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default NotFound;