"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef } from "react";

type SpotlightAccent = "green" | "cyan" | "magenta";
type SpotlightVariant = "premium" | "cyber";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  variant?: SpotlightVariant;
  accent?: SpotlightAccent;
};

type SpotlightStyle = CSSProperties & {
  "--spotlight-color": string;
};

const accentSpotlights: Record<SpotlightAccent, string> = {
  green: "rgba(0, 255, 136, 0.12)",
  cyan: "rgba(0, 212, 255, 0.12)",
  magenta: "rgba(255, 0, 255, 0.1)",
};

const variantClassNames: Record<SpotlightVariant, string> = {
  premium:
    "rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.025] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_22px_70px_rgba(0,0,0,0.45),0_0_55px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:border-white/[0.12] motion-safe:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_28px_90px_rgba(0,0,0,0.55),0_0_90px_rgba(94,106,210,0.12)]",
  cyber:
    "cyber-card cyber-chamfer transition-all duration-200 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:border-cyber-green/45 motion-safe:hover:shadow-[0_0_0_1px_rgba(0,255,136,0.18),0_0_16px_rgba(0,255,136,0.1),0_22px_70px_rgba(0,0,0,0.42)]",
};

export function SpotlightCard({
  children,
  className,
  spotlightColor,
  variant = "premium",
  accent = "green",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const resolvedSpotlightColor = spotlightColor ?? (variant === "cyber" ? accentSpotlights[accent] : "rgba(94, 106, 210, 0.15)");

  function updateSpotlight(event: PointerEvent<HTMLDivElement>) {
    const card = cardRef.current;

    if (!card || event.pointerType === "touch") {
      return;
    }

    const rect = card.getBoundingClientRect();
    positionRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const { x, y } = positionRef.current;
      card.style.setProperty("--spotlight-x", `${x}px`);
      card.style.setProperty("--spotlight-y", `${y}px`);
      frameRef.current = null;
    });
  }

  return (
    <div
      ref={cardRef}
      className={["group relative overflow-hidden", variantClassNames[variant], className].filter(Boolean).join(" ")}
      onPointerMove={updateSpotlight}
      style={{ "--spotlight-color": resolvedSpotlightColor } as SpotlightStyle}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(320px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--spotlight-color), transparent 62%)",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
