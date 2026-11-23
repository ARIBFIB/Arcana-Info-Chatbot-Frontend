"use client";

import { useAnnouncementsQuery } from "@/api";

export function AnnouncementPulse() {
  const { data: announcements = [], isLoading, isError } = useAnnouncementsQuery();
  const recentAnnouncements = announcements.slice(0, 6);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-charcoal p-5 xl:w-[220px] xl:shrink-0">
      <p className="font-body mb-5 block text-[13px] font-semibold uppercase tracking-wider text-white/40">
        Announcement Pulse
      </p>

      {isLoading && <p className="font-body text-sm text-white/40">Loading…</p>}
      {isError && <p className="font-body text-sm text-error">Unable to load.</p>}
      {!isLoading && !isError && recentAnnouncements.length === 0 && (
        <p className="font-body text-sm text-white/40">No announcements yet.</p>
      )}

      <div className="flex flex-col divide-y divide-white/[0.05]">
        {recentAnnouncements.map((item) => (
          <div key={item.id} className="flex flex-col gap-1 py-3 first:pt-0">
            <p className="font-body text-[13px] leading-snug font-normal text-white/90">
              {item.title}
            </p>
            <p className="font-body text-[12px] leading-none text-white/35">
              Viewed by{" "}
              <span className="text-[#3b6fff]">
                {item.audience === "all" ? "100%" : "85%"}
              </span>{" "}
              of employees
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
