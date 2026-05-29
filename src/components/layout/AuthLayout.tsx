import { Link } from "react-router-dom";
import { typograf as t } from "@/lib/typography";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export default function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border shadow-xl md:grid-cols-2">

        {/* ── Left: warm gradient panel ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 md:flex min-h-[540px]"
          style={{
            background: "linear-gradient(145deg, #FDF6EE 0%, #FCEBD4 20%, #F8C86C 45%, #F2994A 65%, #E8643A 85%, #D94E3B 100%)",
          }}
        >
          {/* Amber blob */}
          <div
            className="absolute"
            style={{
              width: 400,
              height: 350,
              right: "-10%",
              top: "15%",
              borderRadius: "45% 55% 60% 40% / 50% 40% 60% 50%",
              filter: "blur(70px)",
              opacity: 0.45,
              pointerEvents: "none",
              background: "radial-gradient(ellipse at center, #FFD700 0%, #F2C94C 40%, transparent 75%)",
            }}
          />
          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "128px 128px",
            }}
          />

          {/* Brand */}
          <Link to="/" className="relative z-10 flex items-center gap-2 text-brand-black/60 hover:text-brand-black transition-colors">
            <span style={{ color: "#E8461E", fontSize: 18 }}>▶</span>
            <span className="font-heading text-sm font-semibold tracking-tight">
              Архив звуков
            </span>
          </Link>

          {/* Hero text */}
          <div className="relative z-10 space-y-3">
            <p className="text-brand-black/40 text-xs font-mono uppercase tracking-[0.2em]">
              Ты можешь
            </p>
            <h2 className="font-heading text-2xl font-bold leading-tight text-brand-black/80 lg:text-3xl">
              {t("Открыть личный")}
              <br />
              {t("архив забытых")}
              <br />
              {t("звуков мира")}
            </h2>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="flex flex-col justify-center bg-background px-6 py-10 sm:px-10 md:px-12">
          {/* Accent star */}
          <div
            className="mb-6 text-2xl select-none md:mb-8"
            style={{ color: "var(--color-brand-amber)" }}
          >
            ✦
          </div>

          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            {t(heading)}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {t(subheading)}
          </p>

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
