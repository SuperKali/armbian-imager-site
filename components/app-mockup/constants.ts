import { Download, Check, Database, HardDrive } from "lucide-react";
import type { Phase } from "./types";

export const BOARD_CDN = "https://cache.armbian.com/images/272";
export const API_URL = "https://github.armbian.com/armbian-images.json";
export const FALLBACK_BOARD_IMG = "/assets/armbian-logo_nofound.png";

export const STEPS = ["MANUFACTURER", "BOARD", "OS", "STORAGE"] as const;
export const ACCENT = "#f26522";
export const GREEN = "#22c55e";
export const DEFAULT_COLOR = "#64748b";

export const DESKTOP_BADGES: Record<string, string> = {
  gnome: "#4a86cf", kde: "#1d99f3", xfce: "#2284f2", cinnamon: "#dc682e",
  budgie: "#6a9fb5", mate: "#9bda5a", i3: "#1a8cff", sway: "#68b0d8",
};
export const KERNEL_BADGES: Record<string, string> = { current: "#10b981", edge: "#ef4444", legacy: "#6b7280", vendor: "#8b5cf6" };
export const tierStyle: Record<string, { bg: string; color: string }> = {
  PLATINUM: { bg: "linear-gradient(135deg,#fcd34d,#f59e0b)", color: "#1a1a1a" },
  STANDARD: { bg: "linear-gradient(135deg,#10b981,#059669)", color: "#fff" },
  COMMUNITY: { bg: "linear-gradient(135deg,#8b5cf6,#7c3aed)", color: "#fff" },
};

export const FLASH_STAGES = [
  { key: "downloading", label: "Downloading image...", icon: Download, indeterminate: false },
  { key: "verifying-sha", label: "Verifying download integrity...", icon: Check, indeterminate: true },
  { key: "decompressing", label: "Decompressing image...", icon: Database, indeterminate: true },
  { key: "writing", label: "Writing image to device...", icon: HardDrive, indeterminate: false },
  { key: "verifying", label: "Verifying written data...", icon: Check, indeterminate: false },
] as const;

export const isModal = (p: Phase) => p === "manufacturer" || p === "board" || p === "os" || p === "storage" || p === "confirm";
