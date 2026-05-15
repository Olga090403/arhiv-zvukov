import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export default function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border shadow-xl md:grid-cols-2">

        {/* ── Left: gradient hero ── */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-black p-10 md:flex min-h-[540px]">
          {/* Gradient blob */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3"
            style={{
              width: 500,
              height: 400,
              borderRadius: "50%",
              filter: "blur(90px)",
              opacity: 0.6,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center, #F2C94C 0%, #F28C4C 30%, #FF6B6B 55%, transparent 80%)",
            }}
          />

          {/* Brand */}
          <Link to="/" className="relative z-10 flex items-center gap-2 text-paper/80 hover:text-paper transition-colors">
            <span style={{ color: "#F2C94C", fontSize: 18 }}>▶</span>
            <span className="font-heading text-sm font-semibold tracking-tight">
              Архив звуков
            </span>
          </Link>

          {/* Hero text */}
          <div className="relative z-10 space-y-3">
            <p className="text-paper/50 text-xs font-mono uppercase tracking-[0.2em]">
              Ты можешь
            </p>
            <h2 className="font-heading text-2xl font-bold leading-tight text-paper lg:text-3xl">
              Открыть личный
              <br />
              архив забытых
              <br />
              звуков мира
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
            {heading}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {subheading}
          </p>

          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
