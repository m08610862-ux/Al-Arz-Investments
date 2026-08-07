import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <p className="text-sm font-medium text-neutral-500 animate-pulse">Loading dashboard...</p>
    </div>
  );
}
