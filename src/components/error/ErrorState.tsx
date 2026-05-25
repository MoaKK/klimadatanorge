"use client";

import { CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  reset: () => void;
};

function ErrorState({ reset }: Props) {
  const t = useTranslations("ui");
  const tErrors = useTranslations("errors");

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlert className="size-10 sm:size-14" />
          </EmptyMedia>
          <EmptyTitle className="text-sm sm:text-lg md:text-xl">{t("error")}</EmptyTitle>
          <EmptyDescription className="text-xs sm:text-sm md:text-base">{tErrors("unknown")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="justify-center">
          <Button onClick={reset}>{t("retry")}</Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export { ErrorState };
