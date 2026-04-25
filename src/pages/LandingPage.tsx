import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SoundCardSkeleton from "@/components/SoundCardSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Play, Shuffle, ArrowRight } from "lucide-react";
import { MOCK_SOUNDS, formatDuration } from "@/lib/mockData";

const EXAMPLES = MOCK_SOUNDS.slice(0, 3);

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  function randomSound() {
    const s = MOCK_SOUNDS[Math.floor(Math.random() * MOCK_SOUNDS.length)];
    navigate(`/sound/${s.id}`);
  }

  return (
    <div className="flex flex-col gap-16">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center gap-8 pt-8 text-center md:pt-16">
        <div className="max-w-2xl space-y-4">
          <Badge
            variant="outline"
            className="font-mono text-xs tracking-widest uppercase"
          >
            Бесплатно · Без регистрации · CC0 / CC BY
          </Badge>

          <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Найди звук,{" "}
            <span
              style={{ color: "var(--color-brand-amber)" }}
              className="italic"
            >
              который исчезает
            </span>
          </h1>

          <p className="text-lg text-muted-foreground">
            Кураторская библиотека забытых бытовых и атмосферных звуков.
            Исказь пресетом, смиксуй как диджей и скачай за&nbsp;2&nbsp;минуты
            — прямо в браузере.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Скрип снега, метро 80-х, старая лампа…"
            className="h-11 flex-1 text-base"
          />
          <Button type="submit" size="lg" className="gap-2 shrink-0">
            Найти
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <Button
          variant="outline"
          size="sm"
          onClick={randomSound}
          className="gap-2"
        >
          <Shuffle className="h-4 w-4" />
          Случайный звук
        </Button>

        <p className="font-mono text-xs text-muted-foreground">
          Не просто библиотека. Диджей-пульт для звуков, которые исчезают.
        </p>
      </section>

      <Separator />

      {/* ── Examples ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">
            Попробуй без регистрации
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/search")}
            className="gap-1 text-muted-foreground"
          >
            Все звуки
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SoundCardSkeleton key={i} />)
            : null}
          {!loading && EXAMPLES.map((sound) => (
            <Card
              key={sound.id}
              className="group cursor-pointer transition-colors hover:border-primary"
              onClick={() => navigate(`/sound/${sound.id}`)}
            >
              <CardContent className="p-4 space-y-3">
                {/* Waveform placeholder */}
                <div className="flex h-12 items-center gap-0.5 px-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-muted group-hover:bg-primary/30 transition-colors"
                      style={{
                        height: `${20 + Math.sin(i * 0.7) * 14 + Math.random() * 8}%`,
                      }}
                    />
                  ))}
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-sm leading-snug line-clamp-2">
                    {sound.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{formatDuration(sound.duration)}</span>
                    <span>·</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                      {sound.license}
                    </Badge>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/sound/${sound.id}`);
                  }}
                >
                  <Play className="h-3.5 w-3.5" />
                  Слушать
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="rounded-xl border border-border bg-card p-8">
        <h2 className="font-heading text-xl font-semibold mb-6 text-center">
          Как это работает
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
          {[
            { step: "01", title: "Найди звук", desc: "Введи запрос или выбери из категорий" },
            { step: "02", title: "Исказь пресетом", desc: "Lo-fi, Страшно, Ностальгия — один клик" },
            { step: "03", title: "Скачай микс", desc: "Формат .m4a — открывается везде" },
          ].map((item) => (
            <div key={item.step} className="space-y-2">
              <div
                className="font-heading text-3xl font-bold"
                style={{ color: "var(--color-brand-amber)" }}
              >
                {item.step}
              </div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
