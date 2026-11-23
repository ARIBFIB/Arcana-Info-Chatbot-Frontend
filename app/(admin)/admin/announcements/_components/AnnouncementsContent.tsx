"use client";

import { Plus } from "lucide-react";

import { useAnnouncementsQuery } from "@/api";
import { fromApiAudience } from "@/lib/announcement-audience";
import { formatShortDate, formatTime } from "@/lib/format-date";

type AnnouncementsContentProps = {
  onNewClick: () => void;
};

export function AnnouncementsContent({ onNewClick }: AnnouncementsContentProps) {
  const { data: announcements = [], isLoading, isError } = useAnnouncementsQuery();

  return (
    <div className="pt-1">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="Red Hat Display m-0 text-[28px] font-bold leading-tight text-white">
          Announcements
        </h1>
        <button
          type="button"
          onClick={onNewClick}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.08]"
        >
          <Plus size={16} className="text-white" />
          New Announcement
        </button>
      </div>

      {isLoading && (
        <p className="font-body mb-6 block text-base leading-[1.4] font-normal text-ash">
          Loading announcements…
        </p>
      )}

      {isError && (
        <p className="font-body mb-6 block text-base leading-[1.4] font-normal text-error">
          Failed to load announcements. Please sign in and try again.
        </p>
      )}

      {!isLoading && !isError && announcements.length === 0 && (
        <p className="font-body mb-6 block text-base leading-[1.4] font-normal text-ash">
          No announcements yet.
        </p>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-white/12">
              <th className="w-1/2 py-0 pr-2 pb-4 pl-0 text-left">
                <span className="font-display whitespace-nowrap text-base leading-none font-medium text-off-white/40">
                  Announcements
                </span>
              </th>
              <th className="w-[20%] px-2 pb-4 text-left">
                <span className="font-display whitespace-nowrap text-base leading-none font-medium text-off-white/40">
                  Audience
                </span>
              </th>
              <th className="w-[17%] px-2 pb-4 text-left">
                <span className="font-display whitespace-nowrap text-base leading-none font-medium text-off-white/40">
                  Date
                </span>
              </th>
              <th className="w-[13%] px-2 pb-4 text-left">
                <span className="font-display whitespace-nowrap text-base leading-none font-medium text-off-white/40">
                  Time
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/[0.07] transition-colors hover:bg-white/[0.02]"
              >
                <td className="py-5 pr-2 pl-0 align-middle">
                  <span className="font-body text-base leading-none font-normal text-off-white">
                    {row.title}
                  </span>
                </td>
                <td className="px-2 py-5 align-middle">
                  <span className="font-body text-base leading-none font-normal text-off-white">
                    {fromApiAudience(row.audience)}
                  </span>
                </td>
                <td className="px-2 py-5 align-middle">
                  <span className="font-body text-base leading-none font-normal text-off-white">
                    {formatShortDate(row.created_at)}
                  </span>
                </td>
                <td className="px-2 py-5 align-middle">
                  <span className="font-body text-base leading-none font-normal text-off-white">
                    {formatTime(row.created_at)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
