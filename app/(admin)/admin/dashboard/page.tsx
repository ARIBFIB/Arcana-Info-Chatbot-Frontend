import { StatCard } from "@/components/ui";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { AdminWelcome } from "./_components/AdminWelcome";
import { AnnouncementPulse } from "./_components/AnnouncementPulse";
import { QueryResolutionChart } from "./_components/QueryResolutionChart";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col bg-graphite">
      {/* Search header — full width, ThemeToggle pinned at the end */}
      <div className="flex h-[56px] shrink-0 items-center gap-3 border-b border-white/[0.07] bg-graphite px-6">
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

        <ThemeToggle />
      </div>

      {/* Page content */}
      <div className="p-5">
        <AdminWelcome />

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          {/* Left: stat cards + chart directly on page bg — no wrapper card */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard value="92" unit="%" label="AI Training Progress" />
              <StatCard value="99.7" unit="%" label="Knowledge Coverage" />
            </div>
            <QueryResolutionChart />
          </div>

          {/* Right: announcement pulse — its own black card */}
          <AnnouncementPulse />
        </div>
      </div>
    </div>
  );
}
