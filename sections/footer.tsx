import Image from "next/image";
import { Github, MessageCircle, ExternalLink } from "lucide-react";
import { footerSections, footerLicense, footerCopyright } from "@/content/footer";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/armbian/imager", icon: Github },
  { label: "Forum", href: "https://forum.armbian.com", icon: MessageCircle },
  {
    label: "Discord",
    href: "https://discord.gg/armbian",
    icon: ({ className }: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer content */}
        <div className="grid gap-10 py-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <Image
                src="/assets/armbian-icon.png"
                alt="Armbian Imager"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-base font-semibold">Armbian Imager</span>
            </div>
            <p className="text-muted-foreground mb-5 max-w-xs text-[13px] leading-relaxed">
              The open-source imaging tool for Armbian OS. Flash with confidence.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-muted-foreground mb-3 text-[11px] font-semibold uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground group inline-flex items-center gap-1 text-sm transition-colors"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                        {link.href.startsWith("http") && (
                          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-border flex flex-col items-center justify-between gap-2 border-t py-6 text-center sm:flex-row sm:text-left">
          <span className="text-muted-foreground text-xs">{footerCopyright}</span>
          <span className="text-muted-foreground text-xs">{footerLicense}</span>
        </div>
      </div>
    </footer>
  );
}
