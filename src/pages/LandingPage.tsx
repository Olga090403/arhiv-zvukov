import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, ArrowRight, Shuffle, Headphones, ArrowDownRight } from "lucide-react";
import { formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import type { DbSound } from "@/lib/database.types";
import SoundCardSkeleton from "@/components/SoundCardSkeleton";
import { toast } from "sonner";

const MARQUEE_ITEMS = [
  "СКРИП СНЕГА", "✦", "МЕТРО 80-х", "✦", "СТАРАЯ ЛАМПА", "✦",
  "НОЧНОЙ ТРАМВАЙ", "✦", "ПИШУЩАЯ МАШИНКА", "✦", "КОФЕВАРКА", "✦",
  "КАПЕЛЬ С КРЫШИ", "✦", "ДИСКОВЫЙ ТЕЛЕФОН", "✦",
];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [sounds, setSounds] = useState<DbSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeatured() {
      const { data, error: err } = await supabase
        .from("sounds")
        .select("*")
        .eq("status", "approved")
        .order("listen_count", { ascending: false })
        .limit(3);

      if (err) {
        console.error("Supabase error:", err);
        setError("Не удалось загрузить звуки");
        toast.error("Ошибка загрузки данных");
      } else {
        setSounds(data ?? []);
      }
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  async function randomSound() {
    const { data } = await supabase
      .from("sounds")
      .select("id")
      .eq("status", "approved");
    if (data && data.length > 0) {
      const s = data[Math.floor(Math.random() * data.length)];
      navigate(`/sound/${s.id}`);
    } else {
      toast.error("В архиве пока нет звуков");
    }
  }

  return (
    <div className="flex flex-col gap-0 -mt-8 -mx-4 md:-mx-8">
      {/* ── Hero — bold typographic ── */}
      <section className="relative overflow-hidden min-h-[85vh] flex flex-col justify-between">
        {/* Warm gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, #FDF6EE 0%, #FCEBD4 20%, #F8C86C 45%, #F2994A 65%, #E8643A 85%, #D94E3B 100%)",
          }}
        />
        {/* Secondary amber blob */}
        <div
          className="absolute"
          style={{
            width: 600,
            height: 500,
            right: "-5%",
            top: "10%",
            borderRadius: "45% 55% 60% 40% / 50% 40% 60% 50%",
            filter: "blur(80px)",
            opacity: 0.5,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at center, #FFD700 0%, #F2C94C 40%, transparent 75%)",
          }}
        />
        {/* Pink accent blob */}
        <div
          className="absolute"
          style={{
            width: 400,
            height: 350,
            left: "10%",
            bottom: "5%",
            borderRadius: "55% 45% 40% 60% / 45% 55% 45% 55%",
            filter: "blur(70px)",
            opacity: 0.3,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at center, #FF9A76 0%, #FFB88C 50%, transparent 80%)",
          }}
        />
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-8 py-16">
          <div className="mx-auto max-w-7xl w-full">

            {/* ── Title block with geometric shapes ── */}
            <div className="space-y-4 md:space-y-2">
              {/* Line 1 */}
              <div className="flex items-center gap-3 md:gap-5 flex-wrap">
                {/* Circle + arrow icon */}
                <div className="hidden md:flex items-center gap-2 text-brand-black/70">
                  <div className="h-6 w-6 rounded-full border-2 border-brand-black/50" />
                  <ArrowRight className="h-6 w-6" />
                </div>
                <h1
                  className="font-heading font-black tracking-tight leading-[0.9]"
                  style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "#0F0F12" }}
                >
                  найди
                </h1>
                {/* Arrow icon */}
                <ArrowDownRight
                  className="hidden md:block text-brand-black/60"
                  style={{ width: "clamp(2rem, 4vw, 3.5rem)", height: "clamp(2rem, 4vw, 3.5rem)" }}
                />
                {/* Decorative circles */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full" style={{ background: "#0F0F12", opacity: 0.15 }} />
                  <div className="h-7 w-7 rounded-full" style={{ background: "#FDF6EE", opacity: 0.7 }} />
                </div>
              </div>

              {/* Line 2 */}
              <div className="flex items-center gap-3 md:gap-5 flex-wrap">
                <h1
                  className="font-heading font-black tracking-tight leading-[0.9] italic"
                  style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "#0F0F12" }}
                >
                  забытый
                </h1>
                {/* Play button shape */}
                <div className="hidden md:flex items-center gap-1">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: "#0F0F12" }}
                  >
                    <Play className="h-6 w-6 ml-0.5 text-[#F2C94C]" />
                  </div>
                </div>
              </div>

              {/* Line 3 */}
              <div className="flex items-center gap-3 md:gap-5 flex-wrap">
                {/* Double semicircles */}
                <div className="hidden md:flex items-center -space-x-1 text-brand-black/50">
                  <div className="h-10 w-5 rounded-l-full border-2 border-r-0 border-brand-black/30" />
                  <div className="h-10 w-5 rounded-l-full border-2 border-r-0 border-brand-black/30" />
                </div>
                <h1
                  className="font-heading font-black tracking-tight leading-[0.9]"
                  style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "#0F0F12" }}
                >
                  звук
                </h1>
                <span
                  className="font-heading font-black"
                  style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: "#0F0F12", opacity: 0.2 }}
                >
                  .
                </span>
                {/* Triangles */}
                <div className="hidden lg:flex items-center gap-1">
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "18px solid transparent",
                      borderRight: "18px solid transparent",
                      borderBottom: "30px solid rgba(15,15,18,0.15)",
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "14px solid transparent",
                      borderRight: "14px solid transparent",
                      borderBottom: "24px solid rgba(15,15,18,0.1)",
                      transform: "rotate(30deg)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── Subtitle + search ── */}
            <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="max-w-xs space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: "rgba(15,15,18,0.6)" }}>
                  Кураторская библиотека исчезающих звуков.
                  Ищи, исказь пресетом и&nbsp;собери диджей-микс за&nbsp;2&nbsp;минуты.
                </p>
                <Button
                  variant="outline"
                  className="rounded-full border-brand-black/30 text-brand-black/80 hover:bg-brand-black/5 gap-2"
                  onClick={randomSound}
                >
                  <Shuffle className="h-3.5 w-3.5" />
                  Случайный звук
                </Button>
              </div>

              <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Скрип снега, метро 80-х…"
                  className="h-12 flex-1 text-base bg-white/40 backdrop-blur-sm border-brand-black/15 placeholder:text-brand-black/30 text-brand-black rounded-full px-5"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 px-6 gap-2 rounded-full bg-brand-black text-paper hover:bg-brand-black/90"
                >
                  Найти
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="relative z-10 border-t border-brand-black/10 px-4 md:px-8 py-5">
          <div className="mx-auto max-w-7xl flex gap-12 md:gap-20">
            {[
              { value: `${sounds.length || "…"}`, label: "звуков" },
              { value: "3", label: "пресета" },
              { value: "CC0", label: "лицензия" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-xl font-bold md:text-2xl" style={{ color: "#0F0F12" }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: "rgba(15,15,18,0.45)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="border-y border-border bg-card/50 py-4 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`mx-4 font-heading text-2xl font-bold md:text-4xl ${
                item === "✦" ? "text-brand-amber" : "text-foreground/15"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured sounds ── */}
      <section className="px-4 md:px-8 py-16">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
                Избранное из архива
              </span>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                Послушай прямо сейчас
              </h2>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex gap-2 text-muted-foreground"
              onClick={() => navigate("/search")}
            >
              Все звуки
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SoundCardSkeleton key={i} />)
              : sounds.map((sound, idx) => (
                  <article
                    key={sound.id}
                    className="group cursor-pointer space-y-4"
                    onClick={() => navigate(`/sound/${sound.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/10">
                      <span className="absolute top-4 left-5 font-heading text-5xl font-bold opacity-10">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="flex h-20 items-end gap-[2px] pt-6">
                        {Array.from({ length: 48 }).map((_, i) => {
                          const h = 20 + Math.sin(i * 0.5 + idx * 2) * 30 + Math.cos(i * 0.3) * 15;
                          return (
                            <div
                              key={i}
                              className="flex-1 rounded-full bg-foreground/10 group-hover:bg-primary/40 transition-colors"
                              style={{ height: `${Math.max(8, h)}%` }}
                            />
                          );
                        })}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                          <Play className="h-5 w-5 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 px-1">
                      <h3 className="font-medium text-base leading-snug group-hover:text-primary transition-colors">
                        {sound.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{formatDuration(sound.duration)}</span>
                        <span>·</span>
                        <span>{sound.author}</span>
                        <span>·</span>
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                          {sound.license}
                        </Badge>
                      </div>
                      <div className="flex gap-1.5">
                        {sound.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="font-mono text-[10px] text-muted-foreground/70">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
          </div>

          {!loading && !error && sounds.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                В архиве пока нет звуков. Добавь первый через Dashboard!
              </p>
            </div>
          )}
        </div>
      </section>

      <Separator className="mx-4 md:mx-8" />

      {/* ── How it works ── */}
      <section className="px-4 md:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
            Как это работает
          </span>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mt-8">
            {[
              { n: "01", title: "Найди", desc: "Ищи по описанию или выбирай из категорий." },
              { n: "02", title: "Исказь", desc: "Примени пресет — замедли, добавь шум плёнки или пусти в реверс." },
              { n: "03", title: "Скачай", desc: "Собери микс из 3 дорожек и скачай .m4a." },
            ].map((item) => (
              <div key={item.n} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-4xl font-bold" style={{ color: "var(--color-brand-amber)" }}>
                    {item.n}
                  </span>
                  <Separator className="flex-1" />
                </div>
                <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden px-4 md:px-8 py-20 md:py-28">
        {/* Warm gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, #FDF6EE 0%, #FCEBD4 20%, #F8C86C 45%, #F2994A 65%, #E8643A 85%, #D94E3B 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 500,
            height: 400,
            left: "50%",
            top: "20%",
            transform: "translateX(-50%)",
            borderRadius: "45% 55% 60% 40% / 50% 40% 60% 50%",
            filter: "blur(80px)",
            opacity: 0.4,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at center, #FFD700 0%, #F2C94C 40%, transparent 75%)",
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center gap-6">
          <Headphones className="h-8 w-8" style={{ color: "rgba(15,15,18,0.4)" }} />
          <h2 className="font-heading text-3xl font-bold md:text-5xl max-w-lg" style={{ color: "#0F0F12" }}>
            Начни слушать прямо сейчас
          </h2>
          <p className="max-w-sm" style={{ color: "rgba(15,15,18,0.55)" }}>
            Никакой регистрации. Открой, найди, смиксуй и скачай.
          </p>
          <div className="flex gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/search")}
              className="gap-2 rounded-full bg-brand-black text-paper hover:bg-brand-black/90"
            >
              <ArrowRight className="h-4 w-4" />
              Открыть архив
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/mixer")}
              className="gap-2 rounded-full border-brand-black/30 text-brand-black/80 hover:bg-brand-black/5"
            >
              Микшер
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
