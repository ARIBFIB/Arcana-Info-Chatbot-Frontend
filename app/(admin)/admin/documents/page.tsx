"use client";

import { useState } from "react";

import { AddDocumentForm } from "./_components/AddDocumentForm";
import { DocumentsContent } from "./_components/DocumentsContent";

export default function DocumentsPage() {
  const [view, setView] = useState<"list" | "add">("list");

  return (
    <div className="flex flex-col bg-graphite">
      <div className="flex h-[56px] shrink-0 items-center border-b border-white/[0.07] bg-graphite px-6">
        <div className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] bg-charcoal px-3 py-2">
          <svg
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            className="shrink-0 text-white/35"
          >
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M13.5 13.5L17 17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>
      <div className="p-5">
        {view === "list" ? (
          <DocumentsContent onAddClick={() => setView("add")} />
        ) : (
          <AddDocumentForm
            onCancel={() => setView("list")}
            onSuccess={() => setView("list")}
          />
        )}
      </div>
    </div>
  );
}
