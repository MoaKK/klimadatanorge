"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="nb" className="dark">
      <body className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground sm:text-base">
            Noe gikk galt / Something went wrong
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground sm:text-base"
          >
            Prøv igjen / Try again
          </button>
        </div>
      </body>
    </html>
  );
}

export default GlobalError;