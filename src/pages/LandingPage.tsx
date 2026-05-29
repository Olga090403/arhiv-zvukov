import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shuffle, ArrowRight, Play, ArrowDownRight } from "lucide-react";
import { CATEGORIES, formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import type { DbSound } from "@/lib/database.types";
import SoundCardSkeleton from "@/components/SoundCardSkeleton";
import { toast } from "sonner";

const MARQUEE_ITEMS = [
  "СКРИП СНЕГА", "✦", "МЕТРО 80-х", "✦", "СТАРАЯ ЛАМПА", "✦",
  "НОЧНОЙ ТРАМВАЙ", "✦", "REELS", "✦", "LO-FI", "✦", "МИКС ЗА 2 МИН", "✦",
];

const CATEGORY_ICONS: Record<string, string> = {
  Природа: "❄",
  Город: "🚇",
  Техника: "💡",
  Ностальгия: "📼",
  Атмосфера: "🌙",
};

function WaveformBars({ seed }: { seed: number }) {
  const bars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const h = 20 + Math.sin(i * 0.45 + seed) * 28 + Math.cos(i * 0.25 + seed * 2) * 12;
      return Math.max(12, h);
    });
  }, [seed]);

  return (
    <div className="flex h-12 items-end gap-[2px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-full bg-brand-black/15 group-hover:bg-brand-orange/60 transition-colors"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function FloatCard({
  sound,
  index,
  onClick,
}: {
  sound: DbSound;
  index: number;
  onClick: () => void;
}) {
  const rotations = ["-rotate-[5deg]", "rotate-[4deg]", "-rotate-[2deg]"];
  const positions = ["top-0 left-0 z-30", "top-10 right-0 z-20", "bottom-0 left-[12%] z-10"];

  return (
    <article
      className={`group absolute w-full max-w-[280px] cursor-pointer rounded-2xl border-2 border-white/60 bg-white/95 p-5 shadow-2xl shadow-brand-orange/20 backdrop-blur transition-transform hover:-translate-y-2 hover:rotate-0 ${positions[index]} ${rotations[index]}`}
      onClick={onClick}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-brand-orange font-bold">
        #{(sound.tags[0] ?? "vibe").toLowerCase()}
      </span>
      <h3 className="mt-1 text-sm font-bold leading-snug">{sound.title}</h3>
      <div className="mt-3">
        <WaveformBars seed={index * 1.7} />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-black/70 group-hover:text-brand-orange">
        <Play className="h-3 w-3 fill-current" />
        Слушать
      </div>
    </article>
  );
}

export default function LandingPage() {
  const [sounds, setSounds] = useState<DbSound[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFeatured() {
      const [featuredRes, countRes] = await Promise.all([
        supabase.from("sounds").select("*").eq("status", "approved").order("listen_count", { ascending: false }).limit(3),
        supabase.from("sounds").select("*", { count: "exact", head: true }).eq("status", "approved"),
      ]);

      if (featuredRes.error) {
        setError("Не удалось загрузить звуки");
        toast.error("Ошибка загрузки данных");
      } else {
        setSounds(featuredRes.data ?? []);
      }
      if (!countRes.error && countRes.count != null) setTotalCount(countRes.count);
      setLoading(false);
    }
    fetchFeatured();
  }, []);

  async function randomSound() {
    const { data } = await supabase.from("sounds").select("id").eq("status", "approved");
    if (data?.length) {
      navigate(`/sound/${data[Math.floor(Math.random() * data.length)].id}`);
    } else {
      toast.error("В архиве пока нет звуков");
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <div className="flex flex-col gap-0 -mt-8">
      {/* Hero — яркий градиент */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-between bg-gradient-hero">
        <div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-yellow-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-20 h-56 w-56 rounded-full bg-orange-400/30 blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-8 py-16">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-black/55">
                для reels · монтажа · pet-проектов
              </p>

              <div className="space-y-1 md:space-y-0">
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <h1
                    className="font-heading font-black lowercase leading-[0.88] tracking-tight text-brand-black"
                    style={{ fontSize: "clamp(3rem, 11vw, 7rem)" }}
                  >
                    найди
                  </h1>
                  <ArrowDownRight className="hidden md:block h-10 w-10 text-brand-black/50 md:h-14 md:w-14" />
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <h1
                    className="font-heading font-black lowercase leading-[0.88] tracking-tight text-brand-black"
                    style={{ fontSize: "clamp(3rem, 11vw, 7rem)" }}
                  >
                    звук
                  </h1>
                  <span
                    className="font-heading font-black text-brand-black/20"
                    style={{ fontSize: "clamp(3rem, 11vw, 7rem)" }}
                  >
                    .
                  </span>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-base md:text-lg font-medium text-brand-black/65 leading-relaxed">
                Редкие бытовые звуки + lo-fi пресеты + микшер в браузере.
                Собери атмосферу для Reels или учебного проекта за пару минут.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 flex max-w-lg items-center gap-2 rounded-full border-2 border-white/70 bg-white/90 py-1.5 pl-5 pr-1.5 shadow-xl shadow-brand-orange/15"
              >
                <Search className="h-4 w-4 shrink-0 text-brand-black/40" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="скрип снега, метро 80-х, кофеварка…"
                  className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 font-medium"
                />
                <Button type="submit" size="lg" className="shrink-0">
                  Найти
                </Button>
              </form>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button size="lg" onClick={randomSound}>
                  <Shuffle className="h-4 w-4" />
                  Случайный звук
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/mixer")}>
                  Открыть микшер
                </Button>
              </div>
            </div>

            <div className="relative hidden min-h-[360px] lg:block">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-full max-w-[280px] rounded-2xl bg-white/80 p-5 ${["top-0 left-0", "top-10 right-0", "bottom-0 left-[12%]"][i]}`}
                    >
                      <SoundCardSkeleton />
                    </div>
                  ))
                : sounds.map((sound, i) => (
                    <FloatCard key={sound.id} sound={sound} index={i} onClick={() => navigate(`/sound/${sound.id}`)} />
                  ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-brand-black/10 px-4 md:px-8 py-6 bg-white/20 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl gap-10 md:gap-16">
            {[
              { value: totalCount ?? (loading ? "…" : sounds.length), label: "звуков" },
              { value: "3", label: "пресета" },
              { value: "0 ₽", label: "на старте" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-3xl font-black md:text-5xl text-brand-black">{stat.value}</p>
                <p className="text-sm font-medium text-brand-black/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y-2 border-brand-orange/20 bg-white py-5">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`mx-5 font-heading text-2xl font-black md:text-4xl ${
                item === "✦" ? "text-gradient-sunset" : "text-brand-black/10"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile featured */}
      <section className="px-4 md:px-8 py-16 lg:hidden bg-background">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">горячее</span>
            <h2 className="mt-2 font-heading text-3xl font-black">Послушай прямо сейчас</h2>
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="grid gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SoundCardSkeleton key={i} />)
              : sounds.map((sound) => (
                  <article
                    key={sound.id}
                    className="cursor-pointer rounded-2xl border-2 border-brand-orange/20 bg-white p-5 shadow-lg transition-all hover:-translate-y-0.5 hover:border-brand-orange"
                    onClick={() => navigate(`/sound/${sound.id}`)}
                  >
                    <h3 className="font-bold">{sound.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                      {formatDuration(sound.duration)} · {sound.author}
                    </p>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-8 py-16 bg-background">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">каталог</span>
          <h2 className="mt-2 mb-8 font-heading text-3xl font-black md:text-4xl">Выбирай по вайбу</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {CATEGORIES.filter((c) => c !== "Все").map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                className="rounded-2xl border-2 border-brand-orange/25 bg-white py-6 text-center shadow-md transition-all hover:-translate-y-1 hover:border-brand-orange hover:shadow-xl hover:shadow-brand-orange/15"
              >
                <div className="text-3xl mb-2">{CATEGORY_ICONS[cat] ?? "🔊"}</div>
                <div className="text-sm font-bold">{cat}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden px-4 md:px-8 py-16 bg-gradient-hero">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-black/50">как это работает</span>
          <h2 className="mt-2 mb-10 font-heading text-3xl font-black md:text-4xl">3 шага до крутого микса</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Найди", desc: "Опиши звук словами — «скрип снега», «гудок метро»." },
              { n: "02", title: "Исказь", desc: "Lo-fi, «Страшно» или «Ностальгия» — один клик." },
              { n: "03", title: "Смиксуй", desc: "До 3 дорожек → скачай .m4a → в Reels или монтаж." },
            ].map((item) => (
              <div key={item.n} className="rounded-2xl border-2 border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur">
                <span className="font-heading text-4xl font-black text-gradient-sunset">{item.n}</span>
                <h3 className="mt-2 font-heading text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm font-medium text-brand-black/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mixer CTA */}
      <section className="px-4 md:px-8 py-20 bg-brand-black text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-amber mb-4">микшер</p>
          <h2 className="font-heading text-3xl font-black md:text-5xl mb-4">Смешай свой саунд</h2>
          <p className="mx-auto max-w-md text-white/65 mb-8 font-medium">
            Добавь звук → крути пресет → скачай. Идеально для pet-проектов и учёбы.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Lo-fi", "Страшно", "Ностальгия"].map((p, i) => (
              <span
                key={p}
                className={`font-mono text-xs font-bold px-4 py-2 rounded-full ${
                  i === 0 ? "bg-gradient-sunset text-brand-black" : "border border-white/20 bg-white/10"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
          <Button size="lg" onClick={() => navigate("/mixer")}>
            Открыть микшер
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 md:px-8 py-20 text-center bg-gradient-hero">
        <div className="mx-auto max-w-7xl space-y-6">
          <h2 className="font-heading text-3xl font-black md:text-5xl tracking-tight">Залетай в архив</h2>
          <p className="font-medium text-brand-black/60">Бесплатно · без регистрации · CC0</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={randomSound}>
              <Shuffle className="h-4 w-4" />
              Случайный звук
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/search")}>
              Все звуки
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
