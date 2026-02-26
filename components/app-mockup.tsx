"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  Factory,
  Cpu,
  Database,
  HardDrive,
  Check,
  X,
  Search,
  Settings,
  FolderOpen,
  Download,
  Monitor,
  Terminal,
  Zap,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

/* ─── CDN ────────────────────────────────────────── */
const BOARD_CDN = "https://cache.armbian.com/images/272";
const VENDOR_CDN = "https://cache.armbian.com/images/vendors/150";

/* ─── constants ──────────────────────────────────── */
const STEPS = ["MANUFACTURER", "BOARD", "OS", "STORAGE"] as const;
const ACCENT = "#f26522";
const GREEN = "#22c55e";

/* ─── theme colors (from real Armbian Imager CSS) ── */
type TC = {
  bgApp: string; bgCard: string; bgSec: string;
  border: string; borderLight: string;
  text: string; textSec: string; textMuted: string; textDim: string; textDim2: string;
  overlay: string; shadow: string; shadowHeavy: string;
  titleBarBg: string; titleBarBorder: string; titleBarText: string;
  pillsBg: string; pillsBorder: string; pillStepBg: string; pillStepColor: string;
  logoFilter: string; selectedBg: string; clickBg: string;
  warningBg: string; warningBorder: string;
  deviceIconBg: string; deviceIconColor: string;
  inactiveTabBg: string; inactiveTabBorder: string;
};

const darkT: TC = {
  bgApp: "#1a1a1a", bgCard: "#2a2a2a", bgSec: "#252525",
  border: "#404040", borderLight: "#333333",
  text: "#fff", textSec: "#aaa", textMuted: "#888", textDim: "#777", textDim2: "#555",
  overlay: "rgba(0,0,0,0.7)", shadow: "0 1px 3px rgba(0,0,0,0.3)", shadowHeavy: "0 8px 24px rgba(0,0,0,0.4)",
  titleBarBg: "#2a2a2a", titleBarBorder: "#333333", titleBarText: "#aaa",
  pillsBg: "rgba(255,255,255,0.05)", pillsBorder: "rgba(255,255,255,0.1)",
  pillStepBg: "rgba(255,255,255,0.1)", pillStepColor: "#888",
  logoFilter: "none", selectedBg: "rgba(242,101,34,0.1)", clickBg: "rgba(242,101,34,0.12)",
  warningBg: "rgba(239,68,68,0.12)", warningBorder: "rgba(239,68,68,0.2)",
  deviceIconBg: "#1e3a5f", deviceIconColor: "#60a5fa",
  inactiveTabBg: "linear-gradient(135deg,#2a2a2a,#252525)", inactiveTabBorder: "1px solid #404040",
};

const lightT: TC = {
  bgApp: "#f8f9fa", bgCard: "#ffffff", bgSec: "#eef0f2",
  border: "#d0d4d8", borderLight: "#e5e8eb",
  text: "#1a1a1a", textSec: "#555555", textMuted: "#666666", textDim: "#777777", textDim2: "#999999",
  overlay: "rgba(0,0,0,0.5)", shadow: "0 1px 3px rgba(0,0,0,0.08)", shadowHeavy: "0 8px 24px rgba(0,0,0,0.12)",
  titleBarBg: "#ececec", titleBarBorder: "#d4d4d4", titleBarText: "#666",
  pillsBg: "#f0f2f4", pillsBorder: "#d0d4d8",
  pillStepBg: "#e0e3e6", pillStepColor: "#666666",
  logoFilter: "none", selectedBg: "rgba(242,101,34,0.08)", clickBg: "rgba(242,101,34,0.1)",
  warningBg: "rgba(239,68,68,0.08)", warningBorder: "rgba(239,68,68,0.15)",
  deviceIconBg: "#dbeafe", deviceIconColor: "#3b82f6",
  inactiveTabBg: "linear-gradient(135deg,#ffffff,#eef0f2)", inactiveTabBorder: "1px solid #d0d4d8",
};

const ThemeCtx = createContext<TC>(darkT);
const useC = () => useContext(ThemeCtx);

/* ─── data ───────────────────────────────────────── */
const manufacturers = [
  { name: "Shenzhen FriendlyARM Technology Co., Ltd.", boards: 37, slug: "friendlyelec" },
  { name: "Radxa Computer Co.,Limited", boards: 36, slug: "radxa" },
  { name: "Khadas (Shenzhen Wesion Technology Co., Ltd.)", boards: 9, slug: "khadas" },
  { name: "Mekotronics Co., Ltd", boards: 6, slug: "mekotronics" },
  { name: "Inovato LLC", boards: 1, slug: "inovato" },
];

const boardItems = [
  { name: "NanoPC T6 LTS", slug: "nanopct6-lts", imgs: 14, tier: "PLATINUM" as const },
  { name: "NanoPi M5", slug: "nanopi-m5", imgs: 10, tier: "PLATINUM" as const },
  { name: "NanoPi M6", slug: "nanopi-m6", imgs: 14, tier: "PLATINUM" as const },
  { name: "NanoPi R3S LTS", slug: "nanopi-r3s-lts", imgs: 10, tier: "PLATINUM" as const },
  { name: "NanoPi R6S", slug: "nanopi-r6s", imgs: 14, tier: "PLATINUM" as const },
  { name: "NanoPi R76S", slug: "nanopi-r76s", imgs: 10, tier: "PLATINUM" as const },
  { name: "NanoPC T6", slug: "nanopct6", imgs: 14, tier: "STANDARD" as const },
  { name: "NanoPi K1 Plus", slug: "nanopik1plus", imgs: 9, tier: "STANDARD" as const },
];

const tierStyle: Record<string, { bg: string; color: string }> = {
  PLATINUM: { bg: "linear-gradient(135deg,#fcd34d,#f59e0b)", color: "#1a1a1a" },
  STANDARD: { bg: "linear-gradient(135deg,#10b981,#059669)", color: "#fff" },
};

const osImages = [
  { name: "Armbian 26.2.1 noble", de: "GNOME", kernel: "Vendor 6.1.115", size: "1.1 GB", logo: "ubuntu" as const },
  { name: "Armbian 26.2.1 trixie", de: "CLI", kernel: "Vendor 6.1.115", size: "271 MB", logo: "debian" as const },
  { name: "Armbian 26.2.1 noble", de: "GNOME", kernel: "Current 6.18.8", size: "1.1 GB", logo: "ubuntu" as const },
  { name: "Armbian 26.2.1 noble", de: "KDE", kernel: "Current 6.18.8", size: "1.4 GB", logo: "ubuntu" as const },
];

const deBadge: Record<string, string> = { GNOME: "#4a86cf", CLI: "#64748b", KDE: "#1d99f3" };
const kernelBadge: Record<string, string> = { Vendor: "#8b5cf6", Current: "#10b981", Edge: "#ef4444", Legacy: "#6b7280" };

/* ─── flash stages ────────────────────────────────── */
const FLASH_STAGES = [
  { key: "downloading", label: "Downloading image...", icon: Download, indeterminate: false },
  { key: "verifying-sha", label: "Verifying download integrity...", icon: Check, indeterminate: true },
  { key: "decompressing", label: "Decompressing image...", icon: Database, indeterminate: true },
  { key: "writing", label: "Writing image to device...", icon: HardDrive, indeterminate: false },
  { key: "verifying", label: "Verifying written data...", icon: Check, indeterminate: false },
] as const;

/* ─── types ──────────────────────────────────────── */
type Phase = "home" | "manufacturer" | "board" | "os" | "storage" | "confirm" | "flashing" | "done";
const isModal = (p: Phase) => p === "manufacturer" || p === "board" || p === "os" || p === "storage" || p === "confirm";

/* ════════════════════════════════════════════════════ */
export function AppMockup() {
  const { resolvedTheme } = useTheme();
  const c = resolvedTheme === "light" ? lightT : darkT;
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("home");
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [flashStage, setFlashStage] = useState(0);
  const [clicking, setClicking] = useState(false);

  const completed: number[] =
    step === 0 ? [] :
    step === 1 ? [0] :
    step === 2 ? [0, 1] :
    step === 3 ? [0, 1, 2] :
    [0, 1, 2, 3];

  const activeCard: number =
    phase === "home" ? step :
    phase === "manufacturer" ? 0 :
    phase === "board" ? 1 :
    phase === "os" ? 2 :
    phase === "storage" || phase === "confirm" ? 3 : -1;

  const advance = useCallback(() => {
    setClicking(false);
    if (phase === "home") {
      const modalForStep: Phase[] = ["manufacturer", "board", "os", "storage"];
      setPhase(modalForStep[step] || "manufacturer");
    } else if (phase === "manufacturer") {
      setStep(1); setPhase("home");
    } else if (phase === "board") {
      setStep(2); setPhase("home");
    } else if (phase === "os") {
      setStep(3); setPhase("home");
    } else if (phase === "storage") {
      setPhase("confirm");
    } else if (phase === "confirm") {
      setStep(4); setFlashStage(0); setPhase("flashing");
    } else if (phase === "flashing") {
      setPhase("done");
    } else if (phase === "done") {
      setStep(0); setPhase("home");
    }
  }, [phase, step]);

  useEffect(() => {
    const viewMs: Record<Phase, number> = {
      home: step === 0 ? 1500 : 900,
      manufacturer: 1800, board: 2200, os: 1800,
      storage: 1800, confirm: 1800, flashing: 7500, done: 2000,
    };
    const clickMs = 600;
    const needsClick = phase === "home" || isModal(phase) || phase === "done";
    if (needsClick) {
      const t1 = setTimeout(() => setClicking(true), viewMs[phase]);
      const t2 = setTimeout(advance, viewMs[phase] + clickMs);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      const t = setTimeout(advance, viewMs[phase]);
      return () => clearTimeout(t);
    }
  }, [phase, step, advance]);

  useEffect(() => {
    if (phase !== "flashing") { setProgress(phase === "done" ? 100 : 0); setFlashStage(0); return; }
    setProgress(0); setFlashStage(0);
    const stageMs = [1500, 800, 1000, 3200, 1200];
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    stageMs.forEach((ms, i) => {
      if (i > 0) { elapsed += stageMs[i - 1]; timers.push(setTimeout(() => setFlashStage(i), elapsed)); }
    });
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "flashing") return;
    const stage = FLASH_STAGES[flashStage];
    if (stage.indeterminate) { setProgress(-1); return; }
    setProgress(0);
    let n = 0;
    const total = flashStage === 3 ? 50 : 25;
    const t = setInterval(() => { n++; setProgress(Math.min(Math.round((n / total) * 100), 100)); if (n >= total) clearInterval(t); }, 56);
    return () => clearInterval(t);
  }, [phase, flashStage]);

  if (prefersReducedMotion) {
    return null;
  }

  const homeVisible = phase === "home" || isModal(phase);

  return (
    <ThemeCtx.Provider value={c}>
      <div className="mx-auto w-full max-w-5xl isolate select-none overflow-hidden rounded-xl text-left shadow-2xl" style={{ background: c.bgApp }}>
        {/* ── TITLE BAR ── */}
        <div className="relative z-[70] flex items-center justify-center py-[10px]" style={{ background: c.titleBarBg, borderBottom: `1px solid ${c.titleBarBorder}` }}>
          <div className="absolute left-4 flex gap-[7px]">
            <span className="block h-[12px] w-[12px] rounded-full" style={{ background: "#ff5f57" }} />
            <span className="block h-[12px] w-[12px] rounded-full" style={{ background: "#febc2e" }} />
            <span className="block h-[12px] w-[12px] rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="text-[12px] font-medium" style={{ color: c.titleBarText }}>Armbian Imager</span>
        </div>

        {/* ── HEADER + CONTENT wrapper ── */}
        <div className="relative">
          <div className="flex items-center justify-between px-5 py-[14px] sm:px-7" style={{ background: c.bgApp, borderBottom: `1px solid ${c.borderLight}` }}>
            <Image src="/assets/armbian-logo.png" alt="Armbian" width={170} height={26} className="h-[26px] w-auto sm:h-[32px]" style={{ filter: c.logoFilter }} />
            <StepPills completed={completed} />
          </div>

          <div className="relative" style={{ height: 560, background: c.bgApp }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-5 transition-opacity duration-300 sm:px-8" style={{ opacity: homeVisible ? 1 : 0 }}>
              <HomeCards activeCard={activeCard} clicking={clicking && phase === "home"} step={step} />
            </div>

            <AnimatePresence>
              {phase === "flashing" && (
                <motion.div key="fl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[14px] px-6" style={{ background: c.bgApp }}>
                  <FlashHeader />
                  <FlashStatus stage={flashStage} progress={progress} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase === "done" && (
                <motion.div key="dn" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center px-6" style={{ background: c.bgApp }}>
                  <DoneView clicking={clicking} />
                </motion.div>
              )}
            </AnimatePresence>

            {phase !== "flashing" && phase !== "done" && (
              <div className="absolute right-3 bottom-3 z-10">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px]" style={{ background: c.bgCard, border: `1px solid ${c.border}` }}>
                  <Settings className="h-[16px] w-[16px]" style={{ color: c.textSec }} />
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {isModal(phase) && (
              <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }} className="absolute inset-0 z-50" style={{ background: c.overlay }} />
            )}
          </AnimatePresence>

          <div className="absolute inset-0 z-[60] flex items-center justify-center overflow-hidden p-4" style={{ pointerEvents: isModal(phase) ? "auto" : "none" }}>
            <AnimatePresence mode="wait">
              {phase === "manufacturer" && <ManufacturerModal key="mfg" clicking={clicking} />}
              {phase === "board" && <BoardModal key="brd" clicking={clicking} />}
              {phase === "os" && <OsModal key="os" clicking={clicking} />}
              {phase === "storage" && <StorageModal key="stg" clicking={clicking} />}
              {phase === "confirm" && <ConfirmModal key="cfm" clicking={clicking} />}
            </AnimatePresence>
          </div>
        </div>

        <style jsx global>{`
          .mockup-shimmer { background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.3) 50%,transparent 100%); background-size: 200% 100%; animation: ms 2s infinite linear; }
          @keyframes ms { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          .mockup-indeterminate { animation: mi 1.5s infinite cubic-bezier(0.4,0,0.2,1); }
          @keyframes mi { 0%{transform:translateX(-100%) scaleX(0.8)} 50%{transform:translateX(250%) scaleX(1)} 100%{transform:translateX(600%) scaleX(0.8)} }
        `}</style>
      </div>
    </ThemeCtx.Provider>
  );
}

/* ════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════ */

function StepPills({ completed }: { completed: number[] }) {
  const c = useC();
  return (
    <div className="flex items-center gap-[3px] rounded-[10px] px-[10px] py-[7px]" style={{ background: c.pillsBg, border: `1px solid ${c.pillsBorder}` }}>
      {STEPS.map((s, i) => {
        const done = completed.includes(i);
        return (
          <div key={s} className="flex items-center gap-[5px] rounded-[8px] px-[8px] py-[4px] sm:px-[10px]" style={done ? { background: "rgba(34,197,94,0.15)" } : undefined}>
            <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full text-[10px] font-bold"
              style={done ? { background: GREEN, color: "#fff" } : { background: c.pillStepBg, color: c.pillStepColor }}>
              {done ? <Check className="h-[11px] w-[11px]" /> : i + 1}
            </div>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.3px] sm:inline" style={{ color: done ? GREEN : c.pillStepColor }}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

function HomeCards({ activeCard, clicking, step }: { activeCard: number; clicking: boolean; step: number }) {
  const c = useC();
  const btns = [
    { label: "MANUFACTURER", text: "CHOOSE BRAND", Icon: Factory, filled: { text: "SHENZHEN FRIENDLYARM TECHNOLOGY CO., LTD.", sub: "" } },
    { label: "BOARD", text: "CHOOSE BOARD", Icon: Cpu, filled: { text: "NANOPI M5", sub: "10 images" } },
    { label: "OPERATING SYSTEM", text: "CHOOSE OS", Icon: Database, filled: { text: "GNOME", sub: "noble · vendor" } },
    { label: "STORAGE", text: "CHOOSE STORAGE", Icon: HardDrive, filled: { text: "BUILT IN SDXC READER", sub: "14.8 GB" } },
  ];
  return (
    <>
      <div className="flex w-full justify-center gap-[20px]">
        {btns.map((b, i) => {
          const isFilled = i < step;
          const isActive = i === activeCard;
          const isClicking = isActive && clicking;
          const highlighted = isFilled || isActive;
          return (
            <div key={b.label} className="flex w-full min-w-0 max-w-[280px] flex-col items-center gap-[10px]">
              <span className="text-center text-[11px] font-bold uppercase tracking-[0.8px]" style={{ color: c.textDim }}>{b.label}</span>
              <div className="flex w-full flex-col items-center justify-center gap-[6px] overflow-hidden rounded-[12px] transition-all duration-200"
                style={{
                  height: 140, padding: "20px 16px",
                  background: isClicking ? c.clickBg : c.bgCard,
                  border: `2px solid ${highlighted ? ACCENT : c.border}`,
                  boxShadow: isClicking ? "0 0 0 4px rgba(242,101,34,0.4), 0 0 20px rgba(242,101,34,0.2)" : highlighted ? "0 0 0 3px rgba(242,101,34,0.25)" : c.shadow,
                  transform: isClicking ? "scale(0.96)" : "scale(1)",
                }}>
                <b.Icon style={{ width: 36, height: 36, color: highlighted ? ACCENT : c.textDim2 }} />
                {isFilled ? (
                  <>
                    <span className="w-full text-center text-[15px] font-bold uppercase tracking-[0.4px]"
                      style={{ color: ACCENT, overflow: "hidden", textOverflow: "clip", whiteSpace: "nowrap" }}>{b.filled.text}</span>
                    {b.filled.sub && <span className="text-[12px]" style={{ color: c.textSec }}>{b.filled.sub}</span>}
                  </>
                ) : (
                  <span className="text-center text-[15px] font-bold uppercase tracking-[0.4px]" style={{ color: highlighted ? ACCENT : c.textDim2, maxWidth: 180 }}>{b.text}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-[6px] rounded-[6px] px-[14px] py-[6px]" style={{ border: `1px solid ${c.border}`, color: c.textSec }}>
        <FolderOpen className="h-[14px] w-[14px]" style={{ opacity: 0.7 }} />
        <span className="text-[11px] font-medium">Use Custom Image</span>
      </div>
    </>
  );
}

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useC();
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="flex w-full max-w-[850px] flex-col rounded-[12px]"
      style={{ maxHeight: 480, background: c.bgCard, border: `1px solid ${c.border}`, boxShadow: c.shadowHeavy }}>
      <div className="flex items-center justify-between px-[20px] py-[16px]" style={{ background: c.bgSec, borderBottom: `1px solid ${c.borderLight}`, borderRadius: "12px 12px 0 0" }}>
        <span className="text-[16px] font-semibold" style={{ color: c.text }}>{title}</span>
        <div className="flex items-center justify-center rounded-[4px] p-[4px]" style={{ color: c.textSec }}><X className="h-[18px] w-[18px]" /></div>
      </div>
      {children}
    </motion.div>
  );
}

function SBar({ placeholder }: { placeholder: string }) {
  const c = useC();
  return (
    <div className="px-[20px] py-[16px]" style={{ borderBottom: `1px solid ${c.borderLight}` }}>
      <div className="flex items-center gap-[10px] rounded-[8px] px-[14px] py-[10px]" style={{ border: `2px solid ${ACCENT}`, background: c.bgCard }}>
        <Search style={{ width: 18, height: 18, color: c.textDim, flexShrink: 0 }} />
        <span className="text-[14px]" style={{ color: c.textDim }}>{placeholder}</span>
      </div>
    </div>
  );
}

function ManufacturerModal({ clicking }: { clicking: boolean }) {
  const c = useC();
  return (
    <Modal title="Select Manufacturer">
      <SBar placeholder="Search manufacturer..." />
      <div className="flex flex-1 flex-col overflow-hidden">
        {manufacturers.map((m, i) => {
          const selected = i === 0 && clicking;
          return (
            <motion.button key={m.slug} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
              className="flex w-full items-center gap-[14px] px-[20px] py-[14px] text-left transition-colors duration-200"
              style={{ borderBottom: `1px solid ${c.borderLight}`, background: selected ? c.selectedBg : "transparent" }}>
              <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-[12px]"
                style={{ background: "#fff", padding: 4, border: `1px solid ${c.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <Image src={`${VENDOR_CDN}/${m.slug}.png`} alt={m.name} fill className="object-contain p-[4px]" sizes="56px" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold" style={{ color: c.text }}>{m.name}</p>
                <p className="mt-[2px] text-[12px]" style={{ color: c.textSec }}>{m.boards} boards</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </Modal>
  );
}

function BoardModal({ clicking }: { clicking: boolean }) {
  const c = useC();
  return (
    <Modal title="Select Board">
      <SBar placeholder="Search boards..." />
      <div className="overflow-hidden p-[16px]" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {boardItems.map((b, i) => {
          const isTarget = i === 1;
          const isClicking = isTarget && clicking;
          return (
            <motion.div key={b.slug}
              initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: isClicking ? 0.96 : 1 }}
              transition={{ delay: 0.15 + i * 0.035, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative flex flex-col items-center rounded-[12px] p-[12px] transition-colors duration-200"
              style={{ background: isClicking ? c.clickBg : c.bgCard, border: isClicking ? `2px solid ${ACCENT}` : `1px solid ${c.border}` }}>
              <div className="absolute top-[6px] right-[6px] z-10 flex items-center justify-center gap-[3px] rounded-full px-[6px]"
                style={{ height: 18, background: "#ef4444", fontSize: 10, color: "#fff", fontWeight: 700 }}>
                <Download style={{ width: 10, height: 10 }} />{b.imgs}
              </div>
              <div className="relative mb-[10px] flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-[8px]">
                <Image src={`${BOARD_CDN}/${b.slug}.png`} alt={b.name} fill className="scale-[1.3] object-contain" sizes="100px" unoptimized />
              </div>
              <div className="flex min-h-[50px] flex-col items-center justify-between gap-[2px]">
                <span className="text-center text-[13px] font-semibold leading-[1.3]" style={{ color: c.text }}>{b.name}</span>
                <div className="flex flex-wrap justify-center gap-[4px]" style={{ minHeight: 20 }}>
                  <span className="inline-flex items-center rounded-[10px] px-[8px] py-[3px] text-[9px] font-semibold uppercase tracking-[0.5px]"
                    style={{ background: tierStyle[b.tier].bg, color: tierStyle[b.tier].color, boxShadow: b.tier === "PLATINUM" ? "0 2px 8px rgba(251,191,36,0.5)" : "0 2px 6px rgba(5,150,105,0.4)" }}>
                    {b.tier}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Modal>
  );
}

function OsModal({ clicking }: { clicking: boolean }) {
  const c = useC();
  const tabs = ["All Images", "Recommended", "Stable", "Nightly", "Apps", "Minimal"];
  return (
    <Modal title="Select Operating System">
      <div className="flex gap-[8px] px-[20px] py-[16px]" style={{ borderBottom: `1px solid ${c.borderLight}` }}>
        {tabs.map((t, i) => {
          const active = i === 0;
          return (
            <div key={t} className="whitespace-nowrap rounded-[20px] px-[18px] py-[10px] text-[13px] font-semibold"
              style={active
                ? { background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", boxShadow: "0 4px 12px rgba(249,115,22,0.4)" }
                : { background: c.inactiveTabBg, border: c.inactiveTabBorder, color: c.textSec, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }
              }>{t}</div>
          );
        })}
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {osImages.map((os, i) => {
          const deColor = deBadge[os.de] || "#64748b";
          const kType = os.kernel.startsWith("Vendor") ? "Vendor" : os.kernel.startsWith("Current") ? "Current" : "Legacy";
          const kColor = kernelBadge[kType];
          const selected = i === 0 && clicking;
          return (
            <motion.button key={`${os.de}-${os.kernel}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
              className="flex w-full items-center gap-[14px] px-[20px] py-[14px] text-left transition-colors duration-200"
              style={{ borderBottom: `1px solid ${c.borderLight}`, background: selected ? c.selectedBg : "transparent" }}>
              <div className="flex h-[80px] w-[80px] shrink-0 items-center justify-center">
                {os.logo === "ubuntu"
                  ? <Image src="/assets/ubuntu.png" alt="Ubuntu" width={40} height={40} className="object-contain" />
                  : <Image src="/assets/debian.svg" alt="Debian" width={40} height={40} className="object-contain" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-[2px] truncate text-[14px] font-semibold" style={{ color: c.text }}>{os.name}</p>
                <div className="mt-[6px] flex flex-wrap items-center gap-[8px]">
                  <span className="inline-flex items-center gap-[4px] rounded-[6px] px-[8px] py-[4px] text-[11px] font-semibold"
                    style={{ background: `linear-gradient(135deg,${deColor},${deColor})`, color: "#fff", boxShadow: `0 2px 6px ${deColor}66` }}>
                    {os.de === "CLI" ? <Terminal style={{ width: 11, height: 11 }} /> : <Monitor style={{ width: 11, height: 11 }} />}{os.de}
                  </span>
                  <span className="inline-flex items-center gap-[4px] rounded-[6px] px-[8px] py-[4px] text-[11px] font-semibold"
                    style={{ background: `linear-gradient(135deg,${kColor},${kColor})`, color: "#fff", boxShadow: `0 2px 6px ${kColor}66` }}>
                    <Zap style={{ width: 11, height: 11 }} />{os.kernel}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-[4px] rounded-[10px] px-[10px] text-[11px] font-semibold tracking-[0.3px]"
                style={{ height: 24, background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>
                <Download style={{ width: 11, height: 11 }} />{os.size}
              </div>
            </motion.button>
          );
        })}
      </div>
    </Modal>
  );
}

function StorageModal({ clicking }: { clicking: boolean }) {
  const c = useC();
  return (
    <Modal title="Select Storage Device">
      <div className="flex items-center justify-between gap-[16px] px-[16px] py-[12px]"
        style={{ background: c.warningBg, borderBottom: `1px solid ${c.warningBorder}` }}>
        <div className="flex items-center gap-[12px]">
          <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px]" style={{ background: "rgba(239,68,68,0.2)" }}>
            <AlertTriangle style={{ width: 16, height: 16, color: "#cc3333" }} />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: c.text }}>All data on selected device will be erased</span>
        </div>
        <div className="inline-flex shrink-0 items-center gap-[6px] whitespace-nowrap rounded-[8px] px-[12px] py-[6px] text-[12px] font-semibold"
          style={{ border: `1px solid ${c.border}`, background: c.bgSec, color: c.textSec }}>
          <div className="h-[14px] w-[14px] rounded-full" style={{ border: `2px solid ${c.textMuted}` }} />
          Show system drives
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <motion.button initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.3 }}
          className="flex w-full items-center gap-[14px] px-[20px] py-[14px] text-left transition-all duration-200"
          style={{ borderBottom: `1px solid ${c.borderLight}`, background: clicking ? c.selectedBg : "transparent", boxShadow: clicking ? `inset 0 0 0 2px ${ACCENT}` : "none" }}>
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[12px]" style={{ background: c.deviceIconBg }}>
            <HardDrive style={{ width: 24, height: 24, color: c.deviceIconColor }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-[8px]">
              <p className="mb-[2px] text-[14px] font-semibold" style={{ color: c.text }}>Built In SDXC Reader</p>
              <span className="inline-flex items-center rounded-[12px] px-[8px] py-[4px] text-[11px] font-bold uppercase" style={{ background: "#3b82f6", color: "#fff" }}>SD CARD</span>
            </div>
            <p className="text-[12px]" style={{ color: c.textSec }}>disk6 · 14.8 GB</p>
          </div>
        </motion.button>
      </div>
      <div className="flex justify-center px-[20px] py-[16px]" style={{ borderTop: `1px solid ${c.borderLight}` }}>
        <div className="inline-flex items-center gap-[8px] rounded-[8px] px-[20px] py-[10px] text-[13px] font-semibold"
          style={{ background: c.bgSec, border: `1px solid ${c.border}`, color: c.text }}>
          <RefreshCw style={{ width: 14, height: 14 }} />Refresh Devices
        </div>
      </div>
    </Modal>
  );
}

function ConfirmModal({ clicking }: { clicking: boolean }) {
  const c = useC();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex w-full max-w-[400px] flex-col items-center rounded-[12px] p-[24px] text-center"
      style={{ background: c.bgCard, border: `1px solid ${c.border}`, boxShadow: c.shadowHeavy }}>
      <div className="mb-[16px]"><AlertTriangle style={{ width: 32, height: 32, color: "#fbbf24" }} /></div>
      <h3 className="mb-[8px] text-[18px] font-semibold" style={{ color: c.text }}>Confirm Selection</h3>
      <p className="mb-[12px] text-[14px]" style={{ color: c.textSec }}>You are about to write to:</p>
      <div className="mb-[16px] flex w-full flex-col items-center gap-[4px] rounded-[8px] px-[12px] py-[12px]" style={{ background: c.bgSec }}>
        <span className="text-[14px] font-semibold" style={{ color: c.text }}>Built In SDXC Reader</span>
        <span className="text-[12px]" style={{ color: c.textSec }}>disk6 (14.8 GB)</span>
      </div>
      <p className="mb-[20px] text-[12px] font-bold uppercase" style={{ color: "#ef4444" }}>ALL DATA WILL BE PERMANENTLY ERASED</p>
      <div className="flex gap-[12px]">
        <div className="inline-flex items-center justify-center rounded-[6px] px-[24px] py-[10px] text-[13px] font-semibold"
          style={{ background: c.bgSec, border: `1px solid ${c.border}`, color: c.text }}>Cancel</div>
        <div className="inline-flex items-center justify-center rounded-[6px] px-[24px] py-[10px] text-[13px] font-semibold transition-all duration-150"
          style={{ background: clicking ? "#dc2626" : "#ef4444", color: "#fff", transform: clicking ? "scale(0.95)" : "scale(1)", boxShadow: clicking ? "0 0 0 3px rgba(239,68,68,0.4)" : "none" }}>
          Erase & Flash
        </div>
      </div>
    </motion.div>
  );
}

function FlashHeader() {
  const c = useC();
  return (
    <div className="flex w-full items-center gap-[20px] rounded-[10px] px-[24px] py-[20px]"
      style={{ maxWidth: 620, background: c.bgCard, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-[8px]">
        <Image src={`${BOARD_CDN}/nanopi-m5.png`} alt="NanoPi M5" fill className="scale-[1.3] object-contain" sizes="100px" unoptimized />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
        <h2 className="m-0 text-[20px] font-semibold leading-[1.2]" style={{ color: c.text }}>NanoPi M5</h2>
        <div className="flex flex-wrap items-center gap-[8px]">
          <div className="inline-flex items-center gap-[6px] rounded-full py-[4px] pr-[10px] pl-[6px]" style={{ background: c.bgSec, border: `1px solid ${c.border}` }}>
            <Image src="/assets/ubuntu.png" alt="Ubuntu" width={20} height={20} className="shrink-0 object-contain" />
            <span className="truncate text-[12px] font-medium" style={{ color: c.textSec }}>Armbian 26.2.1 noble</span>
          </div>
          <div className="inline-flex items-center gap-[6px] rounded-full py-[4px] pr-[10px] pl-[8px]"
            style={{ background: "rgba(242,101,34,0.08)", border: "1px solid rgba(242,101,34,0.2)" }}>
            <HardDrive style={{ width: 16, height: 16, color: ACCENT, flexShrink: 0 }} />
            <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Built In SDXC Reader</span>
            <span className="text-[11px]" style={{ color: c.textSec, marginLeft: 4, paddingLeft: 8, borderLeft: "1px solid rgba(242,101,34,0.2)" }}>14.8 GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashStatus({ stage, progress }: { stage: number; progress: number }) {
  const c = useC();
  const current = FLASH_STAGES[stage];
  const StageIcon = current.icon;
  const isIndeterminate = current.indeterminate;
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[10px] px-[24px] py-[24px]"
      style={{ maxWidth: 620, minHeight: 140, background: c.bgCard, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
      <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
        <StageIcon style={{ width: 32, height: 32, color: ACCENT }} />
      </motion.div>
      <h3 className="mt-[10px] mb-0 text-[16px] font-semibold" style={{ color: c.text }}>{current.label}</h3>
      <div className="mt-[16px] flex w-full items-center gap-[16px]">
        <div className="relative h-[10px] flex-1 overflow-hidden rounded-[6px]" style={{ background: c.bgSec, border: `1px solid ${c.borderLight}`, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)" }}>
          {isIndeterminate ? (
            <div className="mockup-indeterminate absolute inset-y-0 left-0 rounded-[6px]" style={{ width: "30%", background: `linear-gradient(90deg,#f97316,${ACCENT},#f97316)` }} />
          ) : (
            <>
              <motion.div className="absolute inset-y-0 left-0 rounded-[6px]"
                style={{ background: `linear-gradient(90deg,${ACCENT},#ff8c42)`, boxShadow: "0 0 10px rgba(242,101,34,0.4)" }}
                animate={{ width: `${Math.max(progress, 0)}%` }} transition={{ duration: 0.1, ease: "linear" }} />
              <div className="mockup-shimmer absolute inset-0" />
            </>
          )}
        </div>
        {!isIndeterminate && (
          <span className="min-w-[50px] text-right text-[15px] font-bold tabular-nums" style={{ color: c.text }}>{Math.max(progress, 0)}%</span>
        )}
      </div>
    </div>
  );
}

function DoneView({ clicking }: { clicking: boolean }) {
  const c = useC();
  return (
    <div className="flex w-full flex-col items-center gap-[14px] px-6" style={{ maxWidth: 620, margin: "0 auto" }}>
      <FlashHeader />
      <div className="flex w-full flex-col items-center justify-center rounded-[10px] px-[24px] py-[24px]"
        style={{ minHeight: 140, background: c.bgCard, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}>
          <Check style={{ width: 32, height: 32, color: "#10b981" }} />
        </motion.div>
        <h3 className="mt-[10px] mb-0 text-[16px] font-semibold" style={{ color: c.text }}>Flash complete!</h3>
        <p className="mt-[8px] text-center text-[14px] leading-relaxed" style={{ color: c.textSec }}>
          Your SD card is ready! You can safely remove the device and insert it into your NanoPi M5.
        </p>
        <div className="mt-[20px] flex gap-[12px]">
          <div className="inline-flex items-center justify-center rounded-[6px] px-[20px] py-[10px] text-[13px] font-semibold"
            style={{ background: c.bgSec, border: `1px solid ${c.border}`, color: c.text }}>Flash Another</div>
          <div className="inline-flex items-center justify-center rounded-[6px] px-[20px] py-[10px] text-[13px] font-semibold transition-all duration-150"
            style={{ background: clicking ? "#e55a1c" : ACCENT, color: "#fff", transform: clicking ? "scale(0.95)" : "scale(1)", boxShadow: clicking ? "0 0 0 3px rgba(242,101,34,0.4)" : "none" }}>
            Done
          </div>
        </div>
      </div>
    </div>
  );
}
