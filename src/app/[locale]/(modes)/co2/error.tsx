"use client";

import { ErrorState } from "@/components/error/ErrorState";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function Error({ reset }: Props) {
  return <ErrorState reset={reset} />;
}

export default Error;