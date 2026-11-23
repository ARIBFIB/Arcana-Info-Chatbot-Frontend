import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import { OutlookCallbackContent } from "./_OutlookCallbackContent";

function CallbackFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-ink)] px-4">
      <Loader2 size={32} className="animate-spin text-[#3b5bff]" />
    </div>
  );
}

export default function OutlookCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <OutlookCallbackContent />
    </Suspense>
  );
}
