"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      const details = error.stack || "";

      // Type-safe window extension check
      const windowWithHostError = window as Window & {
        __recordHostError?: (message: string, details: string) => void;
      };

      windowWithHostError.__recordHostError?.(error.message, details);
      window.parent?.postMessage(
        { type: "host_error", error: error.message, details },
        "*",
      );
      reset();
    } catch {}
  }, [error, reset]);

  return null;
}
