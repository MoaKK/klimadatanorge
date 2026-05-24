import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center px-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinOff />
          </EmptyMedia>
          <EmptyTitle className="text-sm sm:text-lg md:text-xl">
            Siden ble ikke funnet / Page not found
          </EmptyTitle>
          <EmptyDescription className="text-xs sm:text-sm md:text-base">
            Siden du leter etter finnes ikke. / The page you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="justify-center">
          <Button variant="default" asChild>
            <Link href="/nb">Gå hjem / Go home</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default NotFound;