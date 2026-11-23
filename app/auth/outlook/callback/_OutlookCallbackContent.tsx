"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui";
import { ROUTES } from "@/constants";
import { getPostLoginRoute } from "@/lib/auth-routing";
import { getAuthUser } from "@/lib/auth-session";
import { completeOutlookLogin } from "@/lib/outlook-auth";
import { showToast } from "@/lib/toast";

type CallbackState = "loading" | "success" | "error";

const CHECK_GIF_URL =
  "https://cliply.co/wp-content/uploads/2021/03/372103860_CHECK_MARK_400px.gif";

export function OutlookCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<CallbackState>("loading");
  const [userName, setUserName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const code = searchParams.get("code");

      if (!code) {
        if (cancelled) return;
        setState("error");
        setErrorMessage("Missing authorization code. Please try signing in again.");
        return;
      }

      try {
        await completeOutlookLogin(code);
        if (cancelled) return;

        const user = getAuthUser();
        setUserName(user?.name ?? null);
        setState("success");
        showToast.success("Signed in successfully", "Welcome back!");
      } catch (error) {
        if (cancelled) return;
        setState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Outlook sign-in failed.",
        );
        showToast.error("Outlook sign-in failed", "Please try again.");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    const user = getAuthUser();
    router.push(getPostLoginRoute(user));
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-ink)] px-4">
      <div className="relative box-border w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[var(--color-auth-card-bg)] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute -top-10 left-1/2 z-[1] h-[120px] w-[280px] -translate-x-1/2 rounded-[50%] bg-[#5A53FF] opacity-10 blur-[50px]" />

        <div className="relative z-[3] flex flex-col items-center">
          {state === "loading" && (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
                <Loader2 size={32} className="animate-spin text-[#3b5bff]" />
              </div>
              <h3 className="font-body m-0 mb-1 text-[20px] font-semibold text-white">
                Signing you in with Outlook...
              </h3>
              <p className="font-body text-[13px] font-normal text-white/45">
                Please wait a moment.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- external animated GIF, next/image doesn't animate remote gifs reliably without extra config */}
              <img
                src={CHECK_GIF_URL}
                alt="Success checkmark"
                width={96}
                height={96}
                className="mb-4 h-24 w-24 object-contain"
              />
              <h3 className="font-body m-0 mb-2 text-[20px] font-semibold text-white">
                Signed in with Outlook
              </h3>
              <p className="font-body mb-6 text-[15px] font-normal text-white/70">
                Welcome
                {userName ? (
                  <>
                    , <span className="font-semibold text-white">{userName}</span>
                  </>
                ) : null}
                !
              </p>

              <Button
                variant="save"
                onClick={handleContinue}
                className="!h-[44px] !w-full !max-w-[220px] !text-sm"
              >
                Accept &amp; Continue
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#ef4444]/10">
                <TriangleAlert size={32} className="text-[#ef4444]" />
              </div>
              <h3 className="font-body m-0 mb-2 text-[20px] font-semibold text-white">
                Sign-in failed
              </h3>
              <p className="font-body mb-6 text-[13px] font-normal text-white/45">
                {errorMessage ?? "Something went wrong. Please try again."}
              </p>

              <Button
                variant="outline"
                onClick={() => router.push(ROUTES.chat)}
                className="!h-[44px] !w-full !max-w-[220px] !text-sm"
              >
                Back to Chat
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
