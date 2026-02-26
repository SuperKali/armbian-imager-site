import { createContext, useContext } from "react";
import { DESKTOP_BADGES } from "./constants";
import type { ArmbianData, MfgInfo, BoardEntry, OsEntry, Selection } from "./types";

const UBUNTU = new Set(["noble", "jammy", "plucky", "oracular", "focal", "mantic", "lunar"]);

export const DataCtx = createContext<{ data: ArmbianData; sel: Selection }>(null!);
export const useD = () => useContext(DataCtx);

export function extractImages(json: unknown): Record<string, unknown>[] {
  const out: Record<string, unknown>[] = [];
  (function recurse(v: unknown) {
    if (Array.isArray(v)) { v.forEach(recurse); return; }
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      if (obj.board_slug) {
        const ext = String(obj.file_extension || "").toLowerCase();
        const branch = String(obj.branch || "");
        if (ext.includes("img") && !ext.includes("asc") && !ext.includes("torrent") && !ext.includes("sha") && branch !== "cloud") {
          out.push(obj);
        }
      }
      Object.values(obj).forEach(recurse);
    }
  })(json);
  return out;
}

function formatDE(variant: string): { label: string; key: string } {
  const v = variant.toLowerCase();
  for (const de of Object.keys(DESKTOP_BADGES)) {
    if (v.includes(de)) {
      const label = de === "gnome" ? "GNOME" : de === "kde" ? "KDE" : de === "xfce" ? "XFCE" : de === "i3" ? "i3wm" : de.charAt(0).toUpperCase() + de.slice(1);
      return { label, key: de };
    }
  }
  return { label: "CLI", key: "cli" };
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  return `${bytes} B`;
}

function capitalizeVendor(s: string): string {
  if (s === "other") return "Other";
  return s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
}

export function processApiData(rawImages: Record<string, unknown>[]): ArmbianData {
  const today = new Date().toISOString().split("T")[0];

  const boardMap = new Map<string, {
    name: string; vendor: string; vendorName: string; vendorLogo: string | null;
    count: number; hasStandard: boolean; hasCommunity: boolean; platinumUntil: string | null;
    osEntries: OsEntry[]; osKeys: Set<string>;
  }>();

  for (const img of rawImages) {
    const slug = String(img.board_slug || "").toLowerCase();
    if (!slug) continue;

    let entry = boardMap.get(slug);
    if (!entry) {
      entry = {
        name: String(img.board_name || slug),
        vendor: String(img.board_vendor || "other"),
        vendorName: String(img.company_name || ""),
        vendorLogo: img.company_logo ? String(img.company_logo) : null,
        count: 0, hasStandard: false, hasCommunity: false, platinumUntil: null,
        osEntries: [], osKeys: new Set(),
      };
      boardMap.set(slug, entry);
    }
    entry.count++;

    const support = String(img.board_support || "");
    if (support === "conf") {
      if (String(img.platinum || "") === "true" && img.platinum_until) {
        entry.platinumUntil = String(img.platinum_until);
      } else {
        entry.hasStandard = true;
      }
    } else if (support === "csc") {
      entry.hasCommunity = true;
    }

    const distroRelease = String(img.distro || "");
    const { label: deLabel, key: deKey } = formatDE(String(img.variant || "minimal"));
    const branch = String(img.branch || "");
    const kernelVersion = String(img.kernel_version || "");
    const kernelKey = branch.toLowerCase();
    const kernelLabel = (branch.charAt(0).toUpperCase() + branch.slice(1)) + (kernelVersion ? ` ${kernelVersion}` : "");
    const distro: "ubuntu" | "debian" = UBUNTU.has(distroRelease.toLowerCase()) ? "ubuntu" : "debian";
    const version = String(img.armbian_version || "");
    const name = `Armbian ${version} ${distroRelease}`;
    const size = formatSize(parseInt(String(img.file_size || "0"), 10));

    const osKey = `${deKey}-${kernelKey}-${kernelVersion}`;
    if (!entry.osKeys.has(osKey) && entry.osEntries.length < 6) {
      entry.osKeys.add(osKey);
      entry.osEntries.push({ name, de: deLabel, deKey, kernel: kernelLabel, kernelKey, size, distro });
    }
  }

  // Build vendor map
  const vendorMap = new Map<string, { name: string; logo: string | null; boards: BoardEntry[] }>();

  for (const [slug, data] of boardMap) {
    const hasPlatinum = data.platinumUntil ? data.platinumUntil >= today : false;
    const tier: BoardEntry["tier"] = hasPlatinum ? "PLATINUM" : data.hasStandard ? "STANDARD" : "COMMUNITY";
    const hasLogo = !!data.vendorLogo;
    const vendorId = hasLogo ? data.vendor : "other";
    const vendorName = hasLogo ? (data.vendorName || capitalizeVendor(vendorId)) : "Other";

    let vendor = vendorMap.get(vendorId);
    if (!vendor) {
      vendor = { name: vendorName, logo: hasLogo ? data.vendorLogo : null, boards: [] };
      vendorMap.set(vendorId, vendor);
    }
    vendor.boards.push({ slug, name: data.name, imageCount: data.count, tier });
  }

  // Sort boards within each vendor
  const tierOrder = { PLATINUM: 0, STANDARD: 1, COMMUNITY: 2 };
  for (const [, vendor] of vendorMap) {
    vendor.boards.sort((a, b) => (tierOrder[a.tier] - tierOrder[b.tier]) || a.name.localeCompare(b.name));
  }

  // Build manufacturers sorted like the real app
  const mfgEntries = [...vendorMap.entries()]
    .filter(([id]) => id !== "other")
    .map(([id, v]) => ({
      id, name: v.name, logo: v.logo, boardCount: v.boards.length,
      platCount: v.boards.filter(b => b.tier === "PLATINUM").length,
      stdCount: v.boards.filter(b => b.tier === "STANDARD").length,
    }))
    .sort((a, b) => {
      const ap = a.platCount, bp = b.platCount, as_ = a.stdCount, bs = b.stdCount;
      if ((ap > 1) !== (bp > 1)) return ap > 1 ? -1 : 1;
      if (ap > 1 && bp > 1) return bp - ap || b.boardCount - a.boardCount;
      if ((ap === 1) !== (bp === 1)) return ap === 1 ? -1 : 1;
      if (ap === 1 && bp === 1) return bs - as_ || b.boardCount - a.boardCount;
      if ((as_ > 1) !== (bs > 1)) return as_ > 1 ? -1 : 1;
      if (as_ > 1 && bs > 1) return bs - as_ || b.boardCount - a.boardCount;
      return b.boardCount - a.boardCount;
    });

  const manufacturers: MfgInfo[] = mfgEntries.map(({ id, name, logo, boardCount }) => ({ id, name, logo, boardCount }));
  if (vendorMap.has("other")) {
    const o = vendorMap.get("other")!;
    manufacturers.push({ id: "other", name: "Other", logo: null, boardCount: o.boards.length });
  }

  const boardsByMfg: Record<string, BoardEntry[]> = {};
  for (const [id, v] of vendorMap) boardsByMfg[id] = v.boards;

  const imagesByBoard: Record<string, OsEntry[]> = {};
  for (const [slug, data] of boardMap) imagesByBoard[slug] = data.osEntries;

  return { manufacturers, boardsByMfg, imagesByBoard };
}

/* ─── random selection ───────────────────────────── */
function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length <= 1) return arr[0];
  const filtered = exclude !== undefined ? arr.filter(x => x !== exclude) : arr;
  return (filtered.length > 0 ? filtered : arr)[Math.floor(Math.random() * (filtered.length > 0 ? filtered : arr).length)];
}

export function makeSelection(data: ArmbianData, prev?: Selection | null): Selection {
  const eligible = data.manufacturers
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => (data.boardsByMfg[m.id] || []).some(b => b.tier === "PLATINUM" && (data.imagesByBoard[b.slug] || []).length > 0));
  if (eligible.length === 0) return { mfgIdx: 0, boardIdx: 0, osIdx: 0 };

  const mfgEntry = pickRandom(eligible, prev ? eligible.find(e => e.i === prev.mfgIdx) : undefined);
  const { i: mfgIdx, m: mfg } = mfgEntry;
  const boards = data.boardsByMfg[mfg.id] || [];
  const platBoards = boards.map((b, i) => ({ b, i })).filter(({ b }) => b.tier === "PLATINUM" && (data.imagesByBoard[b.slug] || []).length > 0);
  const boardEntry = pickRandom(platBoards, prev && prev.mfgIdx === mfgIdx ? platBoards.find(e => e.i === prev.boardIdx) : undefined);
  const { i: boardIdx, b: board } = boardEntry;
  const osImages = data.imagesByBoard[board.slug] || [];
  const osIdx = osImages.length > 0 ? Math.floor(Math.random() * osImages.length) : 0;

  return { mfgIdx, boardIdx, osIdx };
}

/* ─── helper accessors ───────────────────────────── */
export function selMfg(d: ArmbianData, s: Selection): MfgInfo { return d.manufacturers[s.mfgIdx]; }
export function selBoards(d: ArmbianData, s: Selection): BoardEntry[] { return d.boardsByMfg[selMfg(d, s).id] || []; }
export function selBoard(d: ArmbianData, s: Selection): BoardEntry { return selBoards(d, s)[s.boardIdx]; }
export function selOsImages(d: ArmbianData, s: Selection): OsEntry[] { return d.imagesByBoard[selBoard(d, s).slug] || []; }
export function selOs(d: ArmbianData, s: Selection): OsEntry | undefined { return selOsImages(d, s)[s.osIdx]; }
