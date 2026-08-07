"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 px-4 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Something went wrong</h2>
        <p className="mt-2 text-neutral-600 max-w-md mx-auto">
          We encountered an unexpected error while trying to load this page. Our team has been notified.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-primary-700"
      >
        <RefreshCcw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
