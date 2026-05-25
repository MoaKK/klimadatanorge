import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/skeleton";

async function Loading() {
  const t = await getTranslations("ui");

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 px-4 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-6 w-[clamp(8rem,30vw,14rem)] rounded-md" />
        <p className="text-sm text-muted-foreground sm:text-base">{t("loading")}</p>
      </div>
    </div>
  );
}

export default Loading;