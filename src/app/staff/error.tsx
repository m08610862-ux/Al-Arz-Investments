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
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center">
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm text-center max-w-md w-full">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Dashboard Error</h2>
        <p className="mt-2 text-sm text-neutral-500 mb-6">
          An error occurred while loading this view. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700"
        >
          <RefreshCcw className="h-4 w-4" />
          Reload Data
        </button>
      </div>
    </div>
  );
}
