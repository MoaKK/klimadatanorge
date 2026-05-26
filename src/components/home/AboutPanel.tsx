"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Item, ItemDescription, ItemSeparator, ItemTitle } from "@/components/ui/item";

function AboutPanel() {
  const t = useTranslations("home");

  return (
    <div className="absolute left-4 sm:left-16 lg:left-44 top-16 sm:top-20 z-10 w-[calc(100vw-2rem)] sm:w-80 lg:w-[clamp(18rem,28vw,22rem)]">
      <Item variant="outline" className="flex-col overflow-hidden bg-background/80 p-0">
        <Collapsible className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group h-auto w-full justify-between rounded-none px-3 py-2.5">
              <ItemTitle>{ t("aboutTitle") }</ItemTitle>
              <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="max-h-[50vh] sm:max-h-96 lg:max-h-130 overflow-auto">
            <ItemSeparator className="my-0" />
            <div className="flex flex-col gap-3 p-3">
              <ItemDescription className="line-clamp-none">{ t("aboutBody1") }</ItemDescription>
              <ItemDescription className="line-clamp-none">{ t("aboutBody2") }</ItemDescription>
              <ItemDescription className="line-clamp-none">{ t("aboutBody3") }</ItemDescription>
              <div className="flex flex-col gap-1">
                <ItemTitle className="text-xs">{ t("dataSourcesTitle") }</ItemTitle>
                <div className="flex flex-col gap-0.5">
                  <ItemDescription>{ t("dataSourcesCo2") }</ItemDescription>
                  <ItemDescription>{ t("dataSourcesTemperature") }</ItemDescription>
                  <ItemDescription>{ t("dataSourcesSealevel") }</ItemDescription>
                  <ItemDescription>{ t("dataSourcesPrecipitation") }</ItemDescription>
                  <ItemDescription>{ t("dataSourcesGlacier") }</ItemDescription>
                  <ItemDescription>{ t("dataSourcesAirquality") }</ItemDescription>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Item>
    </div>
  );
}

export { AboutPanel };