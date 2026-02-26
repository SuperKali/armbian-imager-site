"use client";

import { useState, useEffect } from "react";
import { Download, Monitor, Apple, Terminal, ExternalLink } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { SectionObserver } from "@/components/section-observer";
import { MotionWrapper } from "@/components/motion-wrapper";
import { GITHUB_RELEASE_URL } from "@/content/downloads";
import { staggerContainerVariants, fadeUpVariants } from "@/lib/animation-variants";

type Asset = { label: string; href: string };

function detectOS(): string {
  if (typeof navigator === "undefined") return "linux";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  return "linux";
}

function mapRelease(assets: { name: string; browser_download_url: string }[]): Record<string, Asset[]> {
  const find = (pattern: string) =>
    assets.find((a) => a.name.includes(pattern) && !a.name.endsWith(".sig"))?.browser_download_url || "";
  return {
    windows: [
      { label: "Intel / AMD (x64)", href: find("x64-setup.exe") },
      { label: "ARM (arm64)", href: find("arm64-setup.exe") },
    ],
    macos: [
      { label: "Apple Silicon (M1–M4)", href: find("aarch64.dmg") },
      { label: "Intel (x64)", href: find("x64.dmg") },
    ],
    linux: [
      { label: "Intel / AMD (x64)", href: find("amd64.AppImage") },
      { label: "ARM (arm64)", href: find("aarch64.AppImage") },
    ],
  };
}

const FV = "1.2.8";
const FT = "v1.2.8";
const B = "https://github.com/armbian/imager/releases/download";
const FALLBACK: Record<string, Asset[]> = {
  windows: [
    { label: "Intel / AMD (x64)", href: `${B}/${FT}/Armbian.Imager_${FV}_x64-setup.exe` },
    { label: "ARM (arm64)", href: `${B}/${FT}/Armbian.Imager_${FV}_arm64-setup.exe` },
  ],
  macos: [
    { label: "Apple Silicon (M1–M4)", href: `${B}/${FT}/Armbian.Imager_${FV}_aarch64.dmg` },
    { label: "Intel (x64)", href: `${B}/${FT}/Armbian.Imager_${FV}_x64.dmg` },
  ],
  linux: [
    { label: "Intel / AMD (x64)", href: `${B}/${FT}/Armbian.Imager_${FV}_amd64.AppImage` },
    { label: "ARM (arm64)", href: `${B}/${FT}/Armbian.Imager_${FV}_aarch64.AppImage` },
  ],
};

const PLATFORMS = [
  { id: "windows", name: "Windows", icon: Monitor, format: ".exe installer" },
  { id: "macos", name: "macOS", icon: Apple, format: ".dmg disk image" },
  { id: "linux", name: "Linux", icon: Terminal, format: "AppImage" },
] as const;

export function Downloads() {
  const [version, setVersion] = useState(FV);
  const [tag, setTag] = useState(FT);
  const [assetMap, setAssetMap] = useState<Record<string, Asset[]>>(FALLBACK);
  const [userOS, setUserOS] = useState<string | null>(null);

  useEffect(() => {
    setUserOS(detectOS());
    fetch(GITHUB_RELEASE_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.tag_name) {
          setVersion(data.tag_name.replace(/^v/, ""));
          setTag(data.tag_name);
          if (data.assets?.length) setAssetMap(mapRelease(data.assets));
        }
      })
      .catch(() => {});
  }, []);

  // Detected OS first
  const sorted = userOS
    ? [...PLATFORMS.filter((p) => p.id === userOS), ...PLATFORMS.filter((p) => p.id !== userOS)]
    : [...PLATFORMS];

  return (
    <SectionObserver sectionId="downloads" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <MotionWrapper>
          <SectionHeading
            title="Download Armbian Imager"
            subtitle="Available for Windows, macOS, and Linux."
          />
        </MotionWrapper>

        <MotionWrapper variants={staggerContainerVariants}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((platform) => {
              const isDetected = platform.id === userOS;
              const assets = (assetMap[platform.id] || []).filter((a) => a.href);

              return (
                <MotionWrapper key={platform.id} variants={fadeUpVariants}>
                  <div
                    className={`relative overflow-hidden rounded-2xl border transition-shadow ${
                      isDetected
                        ? "border-primary-500/50 bg-primary-500/[0.03] shadow-lg shadow-primary-500/10"
                        : "border-border bg-card"
                    }`}
                  >
                    {/* Accent top bar for detected */}
                    {isDetected && (
                      <div className="from-primary-500 to-primary-600 h-1 w-full bg-gradient-to-r" />
                    )}

                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${isDetected ? "bg-primary-500/10" : "bg-muted"}`}>
                            <platform.icon className={`h-5 w-5 ${isDetected ? "text-primary-500" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold leading-tight">{platform.name}</h3>
                            <span className="text-muted-foreground text-xs">{platform.format}</span>
                          </div>
                        </div>
                        {isDetected && (
                          <span className="bg-primary-500/10 text-primary-500 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">
                            Detected
                          </span>
                        )}
                      </div>

                      {/* Download buttons */}
                      <div className="flex flex-col gap-2.5">
                        {assets.map((asset, i) => (
                          <a
                            key={asset.label}
                            href={asset.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                              isDetected && i === 0
                                ? "border-primary-500 bg-primary-500 text-white hover:bg-primary-600"
                                : "border-border hover:border-primary-500/50 hover:bg-primary-500/[0.04] text-foreground"
                            }`}
                          >
                            <Download className={`h-4 w-4 shrink-0 ${isDetected && i === 0 ? "text-white/80" : "text-muted-foreground group-hover:text-primary-500"}`} />
                            <span className="flex-1">{asset.label}</span>
                            <svg className={`h-4 w-4 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 ${isDetected && i === 0 ? "text-white/60" : "text-primary-500"}`} viewBox="0 0 16 16" fill="none">
                              <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </MotionWrapper>

        {/* All releases link */}
        <MotionWrapper>
          <div className="mt-8 flex justify-center">
            <a
              href={`https://github.com/armbian/imager/releases/tag/${tag}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:border-primary-500/30 hover:bg-primary-500/[0.04] inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm transition-all"
            >
              <span className="bg-primary-500/10 text-primary-500 rounded-full px-2 py-0.5 text-xs font-semibold">v{version}</span>
              <span className="text-muted-foreground">View all releases on GitHub</span>
              <ExternalLink className="text-muted-foreground h-3.5 w-3.5" />
            </a>
          </div>
        </MotionWrapper>
      </div>
    </SectionObserver>
  );
}
