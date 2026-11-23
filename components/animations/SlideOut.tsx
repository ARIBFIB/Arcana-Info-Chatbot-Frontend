"use client";

/**
 * SlideOut is intentionally a re-export of SlideIn.
 * Both directions are handled by the same component.
 * This file exists so existing imports of SlideOut don't break.
 */
export { SlideIn as SlideOut } from "./SlideIn";
