import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, ArrowRight, Shuffle, Headphones } from "lucide-react";
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
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 md:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="gradient-blob top-[-100px] right-[-100px] md:right-[10%] md:top-[-50px]" />
        <div className="gradient-blob-violet gradient-blob bottom-[-200px] left-[-150px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-brand-amber" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">
                Кураторская библиотека
              </span>
            </div>

            <h1 className="font-heading text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              Звуки,{" "}
              <span className="italic" style={{ color: "var(--color-brand-amber)" }}>
                которые
              </span>
              <br />
              исчезают
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg md:text-xl">
              Найди редкий звук, исказь пресетом и&nbsp;собери
              диджей-микс за&nbsp;2&nbsp;минуты. Бесплатно. Без регистрации.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Скрип снега, метро 80-х…"
                className="h-12 flex-1 text-base bg-background/60 backdrop-blur-sm border-border"
              />
              <Button type="submit" size="lg" className="h-12 px-6 gap-2">
                Найти
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={randomSound} className="gap-2">
                <Shuffle className="h-3.5 w-3.5" />
                Случайный звук
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/search")}
                className="gap-2 text-muted-foreground"
              >
                Весь архив
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-16 flex gap-12 md:gap-16">
            {[
              { value: `${sounds.length || "…"}`, label: "звуков" },
              { value: "3", label: "пресета" },
              { value: "CC0", label: "лицензия" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl font-bold md:text-3xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
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

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Grid */}
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

          {/* Empty state */}
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
      <section className="relative overflow-hidden px-4 md:px-8 py-16">
        <div className="gradient-blob top-[-150px] left-[30%] opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center gap-6">
          <Headphones className="h-8 w-8 text-muted-foreground" />
          <h2 className="font-heading text-3xl font-bold md:text-4xl max-w-md">
            Начни слушать прямо сейчас
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Никакой регистрации. Открой, найди, смиксуй и скачай.
          </p>
          <div className="flex gap-3">
            <Button size="lg" onClick={() => navigate("/search")} className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Открыть архив
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/mixer")} className="gap-2">
              Микшер
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
