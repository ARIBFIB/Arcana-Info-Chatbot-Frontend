"use client";

import { useQueryClient } from "@tanstack/react-query";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AuthCard } from "./AuthCard";
import { RegisterCard } from "./RegisterCard";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return;

    gsap.set(overlay, { opacity: 0 });
    gsap.set(card, { opacity: 0, scale: 0.94, y: 16 });

    gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.to(card, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      delay: 0.05,
      ease: "power3.out",
    });
  }, [isOpen]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const card = cardRef.current;
    if (!overlay || !card) return;

    gsap.to(card, {
      opacity: 0,
      scale: 0.94,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      delay: 0.05,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const handleAuthSuccess = () => {
    void queryClient.invalidateQueries();
    onSuccess?.();
    router.refresh();
  };

  const switchView = (next: "login" | "register") => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      opacity: 0,
      scale: 0.96,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        setView(next);
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" },
        );
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[6px]"
      onClick={handleClose}
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
    >
      <div
        ref={cardRef}
        className="relative mx-auto w-full max-w-[380px] will-change-[transform,opacity]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {view === "login" ? (
          <AuthCard
            onClose={handleClose}
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => switchView("register")}
          />
        ) : (
          <RegisterCard
            onClose={handleClose}
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => switchView("login")}
          />
        )}
      </div>
    </div>
  );
}
