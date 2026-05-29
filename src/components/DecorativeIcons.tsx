import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

/** Единый линейный стиль: outline, stroke 2.5, без заливки */
const LINE = {
  fill: "none",
  stroke: "#0F0F12",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function LineIcon({ className, children, viewBox = "0 0 48 48", ...props }: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={cn("size-12 shrink-0", className)} {...props}>
      {children}
    </svg>
  );
}

export function IconStar({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M24 6l4.5 13.5H42L30 27l4.5 13.5L24 33 13.5 40.5 18 27 6 19.5h13.5L24 6z" />
    </LineIcon>
  );
}

export function IconBolt({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M28 4L14 26h10l-4 18 16-24H26l2-16z" />
    </LineIcon>
  );
}

export function IconHeadphones({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M12 28V22a12 12 0 0124 0v6" />
      <rect {...LINE} x="8" y="26" width="8" height="14" rx="4" />
      <rect {...LINE} x="32" y="26" width="8" height="14" rx="4" />
    </LineIcon>
  );
}

export function IconVinyl({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <circle {...LINE} cx="24" cy="24" r="18" />
      <circle {...LINE} cx="24" cy="24" r="6" />
      <path {...LINE} d="M24 6v4M24 38v4M6 24h4M38 24h4" />
    </LineIcon>
  );
}

export function IconWave({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} viewBox="0 0 48 24" {...props}>
      <path {...LINE} d="M2 16c6-10 10 10 16 0s10 10 16 0 6 6 12 0" />
    </LineIcon>
  );
}

export function IconSpark({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M24 8v8M24 32v8M8 24h8M32 24h8M13 13l6 6M29 29l6 6M35 13l-6 6M19 29l-6 6" />
    </LineIcon>
  );
}

export function IconSnow({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M24 6v36M6 24h36M11 11l26 26M37 11L11 37M24 6l-4 4M24 6l4 4M24 42l-4-4M24 42l4-4" />
    </LineIcon>
  );
}

export function IconCity({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M10 38V18l8-6v26M26 38V10l12 8v20" />
      <path {...LINE} d="M6 38h36" />
      <path {...LINE} d="M14 24h2M14 30h2M30 20h2M30 26h2M30 32h2" />
    </LineIcon>
  );
}

export function IconLamp({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M18 38h12M24 6a10 10 0 00-6 16v4h12v-4a10 10 0 00-6-16z" />
      <path {...LINE} d="M20 30h8" />
    </LineIcon>
  );
}

export function IconMoon({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <path {...LINE} d="M30 10a14 14 0 1012 22A12 12 0 0130 10z" />
    </LineIcon>
  );
}

export function IconMic({ className, ...props }: IconProps) {
  return (
    <LineIcon className={className} {...props}>
      <rect {...LINE} x="18" y="8" width="12" height="20" rx="6" />
      <path {...LINE} d="M12 24a12 12 0 0024 0M24 36v6" />
    </LineIcon>
  );
}

export function FloatingSticker({
  children,
  className,
  delay = "0s",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      className={cn("pointer-events-none absolute animate-float select-none opacity-50", className)}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Природа: <IconSnow className="size-11 mx-auto" />,
  Город: <IconCity className="size-11 mx-auto" />,
  Техника: <IconLamp className="size-11 mx-auto" />,
  Ностальгия: <IconVinyl className="size-11 mx-auto" />,
  Атмосфера: <IconMoon className="size-11 mx-auto" />,
};

export const STEP_ICONS = [
  <IconWave key="1" className="size-10" />,
  <IconVinyl key="2" className="size-10" />,
  <IconHeadphones key="3" className="size-10" />,
];

export const BADGE_ICONS = {
  free: IconSpark,
  noreg: IconBolt,
  cc0: IconHeadphones,
};

/** @deprecated use CATEGORY_ICONS */
export const CATEGORY_STICKERS = CATEGORY_ICONS;
/** @deprecated use STEP_ICONS */
export const STEP_STICKERS = STEP_ICONS;
export const StickerStar = IconStar;
export const StickerBolt = IconBolt;
export const StickerHeadphones = IconHeadphones;
export const StickerTape = IconVinyl;
export const StickerSquiggle = IconWave;
export const StickerSmile = IconMoon;
