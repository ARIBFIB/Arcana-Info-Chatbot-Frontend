"use client";

import { useState } from "react";

import { Modal } from "@/components/ui";
import { showToast } from "@/lib/toast";

type CheckState = "idle" | "checking" | "done";

// TODO: replace this dummy check with a real API call once the backend
// exposes an update-check endpoint. Kept as a simulated delay + static
// result for now since no API is wired up yet.
function fakeCheckForUpdates(): Promise<{ hasUpdate: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hasUpdate: false,
        message: "You're all caught up - no new updates available right now.",
      });
    }, 1400);
  });
}

export function UpdateCheckButton() {
  const [state, setState] = useState<CheckState>("idle");
  const [modalOpen, setModalOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleClick = async () => {
    if (state === "checking") return;

    setState("checking");
    try {
      const result = await fakeCheckForUpdates();
      setResultMessage(result.message);
      setState("done");
      setModalOpen(true);

      if (result.hasUpdate) {
        showToast.success("Update available", result.message);
      } else {
        showToast.info("No new updates", result.message);
      }
    } catch {
      setState("idle");
      showToast.error("Couldn't check for updates", "Please try again in a moment.");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setState("idle");
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "checking"}
        aria-busy={state === "checking"}
        className="hero-pill-link group relative cursor-pointer overflow-hidden border-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] disabled:cursor-wait"
      >
        <span className="font-display text-[13px] sm:text-[15px] font-medium leading-none tracking-[-0.2px] text-[var(--text-primary)] whitespace-nowrap">
          {state === "checking" ? "Checking for updates..." : "Product Update v1.1"}
        </span>

        {state === "checking" && (
          <span
            aria-hidden
            className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden rounded-full bg-[var(--border-panel)]"
          >
            <span className="block h-full w-1/3 animate-[update-progress_1.1s_ease-in-out_infinite] rounded-full bg-[var(--color-indigo)]" />
          </span>
        )}
      </button>

      <Modal open={modalOpen} onCancel={handleModalClose} width={400}>
        <div className="px-6 py-7">
          <p className="font-body mb-2 block text-lg leading-none font-bold text-[var(--text-primary)]">
            Click to update
          </p>
          <p className="font-body block text-base leading-[1.5] font-normal text-[var(--text-secondary)]">
            {resultMessage}
          </p>
        </div>
      </Modal>

      <style jsx global>{`
        @keyframes update-progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(150%);
          }
        }
      `}</style>
    </>
  );
}
