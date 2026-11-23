"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ChatSidebarItemProps = {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  onRename?: (newLabel: string) => void;
  onDelete?: () => void;
};

export function ChatSidebarItem({
  label,
  isActive = false,
  onClick,
  onRename,
  onDelete,
}: ChatSidebarItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        itemRef.current &&
        !itemRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const openMenu = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const menuWidth = 150;
      const menuHeightEstimate = 90;
      const spaceBelow = window.innerHeight - rect.bottom;

      setMenuPos({
        top:
          spaceBelow < menuHeightEstimate
            ? rect.top - menuHeightEstimate - 4
            : rect.bottom + 4,
        left: Math.max(8, rect.right - menuWidth),
      });
    }
    setMenuOpen((v) => !v);
  };

  return (
    <div
      ref={itemRef}
      className={`group relative flex w-full items-center rounded-lg transition-colors ${isActive ? "bg-white/[0.06]" : "bg-transparent hover:bg-white/[0.04]"}`}
    >
      <button
        type="button"
        onClick={onClick}
        className="block h-auto min-w-0 flex-1 cursor-pointer border-none bg-transparent px-2 py-1.5 text-left"
      >
        <span
          className={`font-body block w-full overflow-hidden text-sm font-normal leading-[260%] text-ellipsis whitespace-nowrap ${isActive ? "text-off-white" : "text-off-white/65"}`}
        >
          {label}
        </span>
      </button>

      <button
        ref={buttonRef}
        type="button"
        aria-label="Chat options"
        onClick={(e) => {
          e.stopPropagation();
          openMenu();
        }}
        className="mr-1 flex shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-1 text-off-white/40 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/10 hover:text-off-white/80"
      >
        <MoreHorizontal size={16} />
      </button>

      {menuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left }}
            className="z-[2000] w-[150px] overflow-hidden rounded-lg border border-white/10 bg-[#1c1c1f] p-1 shadow-lg"
          >
            {onRename && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  const newLabel = window.prompt("Rename chat", label);
                  if (newLabel && newLabel.trim()) {
                    onRename(newLabel.trim());
                  }
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2.5 py-2 text-left text-off-white/80 hover:bg-white/[0.07]"
              >
                <Pencil size={14} />
                <span className="text-[13px]">Rename</span>
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-2.5 py-2 text-left text-[rgba(239,68,68,0.9)] hover:bg-[rgba(239,68,68,0.1)]"
              >
                <Trash2 size={14} />
                <span className="text-[13px]">Delete</span>
              </button>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
