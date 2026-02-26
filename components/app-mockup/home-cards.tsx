"use client";

import { Check, Factory, Cpu, Database, HardDrive, FolderOpen } from "lucide-react";
import { useC } from "./theme";
import { useD, selMfg, selBoard, selOs } from "./data";
import { STEPS, ACCENT, GREEN } from "./constants";

export function StepPills({ completed }: { completed: number[] }) {
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

export function HomeCards({ activeCard, clicking, step }: { activeCard: number; clicking: boolean; step: number }) {
  const c = useC();
  const { data, sel } = useD();
  const mfg = selMfg(data, sel);
  const board = selBoard(data, sel);
  const os = selOs(data, sel);
  const kType = os ? os.kernel.split(" ")[0].toLowerCase() : "";
  const btns = [
    { label: "MANUFACTURER", text: "CHOOSE BRAND", Icon: Factory, filled: { text: mfg.name.toUpperCase(), sub: "" } },
    { label: "BOARD", text: "CHOOSE BOARD", Icon: Cpu, filled: { text: board.name.toUpperCase(), sub: `${board.imageCount} images` } },
    { label: "OPERATING SYSTEM", text: "CHOOSE OS", Icon: Database, filled: { text: os?.de || "CLI", sub: os ? `${os.name.split(" ").pop()} · ${kType}` : "" } },
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
