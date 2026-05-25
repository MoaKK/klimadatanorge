"use client";

import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { Button } from "../ui/button";

type Props = {
  children: ReactNode;
  className?: string;
};

function ModeHelp({ children, className }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "text-primary transition-colors hover:text-foreground",
            className
          )}
          variant="ghost"
        >
          <span className="relative flex size-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/30" />
            <CircleHelp className="relative size-5" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-64 text-sm">
        {children}
      </PopoverContent>
    </Popover>
  );
}

export { ModeHelp };