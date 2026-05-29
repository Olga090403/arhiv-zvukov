import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shuffle, ArrowRight, Play } from "lucide-react";
import { CATEGORIES, formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import type { DbSound } from "@/lib/database.types";
import SoundCardSkeleton from "@/components/SoundCardSkeleton";
import { toast } from "sonner";
import {
  FloatingSticker,
  IconBolt,
  IconHeadphones,
  IconStar,
  IconVinyl,
  IconWave,
  CATEGORY_ICONS,
  STEP_ICONS,
  BADGE_ICONS,
} from "@/components/DecorativeIcons";

const MARQUEE_ITEMS = [
  "СКРИП СНЕГА", "✦", "МЕТРО 80-х", "✦", "REELS", "✦", "LO-FI", "✦", "МИКС ЗА 2 МИН", "✦",
  "TIKTOK", "✦", "CC0", "✦", "VHS", "✦",
];

const WHITE_BTN = "bg-white border-white/80 text-brand-black shadow-lg hover:bg-white hover:brightness-105";

const HERO_BADGES = [
  { icon: BADGE_ICONS.free, label: "бесплатно" },
  { icon: BADGE_ICONS.noreg, label: "без регистрации" },
  { icon: BADGE_ICONS.cc0, label: "CC0" },
];

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
      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-white/80 bg-white px-4 py-2 text-xs font-bold text-brand-black shadow-md transition-all group-hover:shadow-lg group-hover:brightness-105"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Play className="h-3 w-3 fill-current" />
        Слушать звук
      </button>
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
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[min(94vh,960px)] flex flex-col justify-between bg-gradient-hero">
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-yellow-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-24 h-64 w-64 rounded-full bg-orange-400/15 blur-3xl" />

        <FloatingSticker className="left-[4%] top-[14%] hidden xl:block" delay="0s">
          <IconStar className="size-16" />
        </FloatingSticker>
        <FloatingSticker className="right-[5%] bottom-[22%] hidden xl:block" delay="1.2s">
          <IconHeadphones className="size-16" />
        </FloatingSticker>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-8 py-20 md:py-28 lg:py-32">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:gap-24 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-10 max-w-xl lg:max-w-none">
              <div className="flex flex-wrap gap-3">
                {HERO_BADGES.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-brand-black/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-black shadow-sm"
                  >
                    <Icon className="size-5" />
                    {label}
                  </span>
                ))}
              </div>

              <div>
                <h1
                  className="font-heading font-black lowercase leading-[0.92] tracking-tight text-brand-black"
                  style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
                >
                  найди
                </h1>
                <div className="mt-1 flex items-center gap-3">
                  <h1
                    className="font-heading font-black lowercase leading-[0.92] tracking-tight"
                    style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
                  >
                    <span className="text-brand-black">звук</span>
                  </h1>
                  <span
                    className="font-heading font-black text-brand-black/20"
                    style={{ fontSize: "clamp(2.5rem, 8vw, 5.5rem)" }}
                  >
                    .
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg md:text-xl font-bold text-brand-black/80 leading-relaxed max-w-lg">
                  Тот самый вайб для Reels, монтажа и учебки — за 20 секунд
                </p>
                <p className="text-base font-medium text-brand-black/55 leading-relaxed max-w-md">
                  Редкие бытовые звуки · lo-fi пресеты · микшер прямо в браузере
                </p>
              </div>

              <form onSubmit={handleSearch} className="flex max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-full border-2 border-white/70 bg-white/95 py-2.5 pl-6 pr-4 shadow-xl shadow-brand-orange/10">
                  <Search className="h-4 w-4 shrink-0 text-brand-black/40" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="скрип снега, метро 80-х, кофеварка…"
                    className="h-12 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 font-medium"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full shrink-0 sm:w-auto">
                  Найти
                </Button>
              </form>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="outline" className={WHITE_BTN} onClick={randomSound}>
                  <Shuffle className="h-4 w-4" />
                  Случайный звук
                </Button>
                <Button size="lg" variant="outline" className={WHITE_BTN} onClick={() => navigate("/mixer")}>
                  Открыть микшер
                </Button>
              </div>
            </div>

            <div className="relative hidden min-h-[480px] lg:block">
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

        <div className="relative z-10 border-t border-brand-black/10 px-4 md:px-8 py-8 md:py-10 bg-background">
          <div className="mx-auto flex max-w-7xl gap-12 md:gap-20">
            {[
              { value: totalCount ?? (loading ? "…" : sounds.length), label: "звуков" },
              { value: "3", label: "пресета" },
              { value: "CC0", label: "лицензия" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-2xl font-black md:text-4xl text-brand-black">{stat.value}</p>
                <p className="text-xs md:text-sm font-medium text-brand-black/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee — подтянут выше */}
      <div className="-mt-1 overflow-hidden border-y-2 border-brand-orange/20 bg-white py-5">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`mx-4 font-heading text-xl font-black md:text-3xl ${
                item === "✦" ? "text-gradient-sunset" : "text-brand-black/10"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile featured */}
      <section className="px-4 md:px-8 py-20 md:py-24 lg:hidden bg-background">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center gap-4">
            <IconBolt className="size-11 shrink-0" />
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">горячее</span>
              <h2 className="font-heading text-2xl font-black">Послушай прямо сейчас</h2>
            </div>
          </div>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="grid gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SoundCardSkeleton key={i} />)
              : sounds.map((sound) => (
                  <article
                    key={sound.id}
                    className="cursor-pointer rounded-2xl border-2 border-brand-orange/20 bg-white p-6 min-h-[100px] shadow-lg transition-all hover:-translate-y-0.5 hover:border-brand-orange"
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
      <section className="px-4 md:px-8 py-20 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-orange">каталог</span>
              <h2 className="font-heading text-3xl font-black md:text-4xl">Выбирай по вайбу</h2>
            </div>
            <IconWave className="hidden sm:block w-16 opacity-60" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
            {CATEGORIES.filter((c) => c !== "Все").map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                className="rounded-2xl border-2 border-brand-orange/25 bg-white py-10 md:py-12 px-3 min-h-[140px] flex flex-col items-center justify-center text-center shadow-md transition-all hover:-translate-y-1 hover:border-brand-orange hover:shadow-xl hover:shadow-brand-orange/15"
              >
                <div className="mb-3 flex justify-center">{CATEGORY_ICONS[cat]}</div>
                <div className="text-sm font-bold">{cat}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — акцентный градиент между бумажными блоками */}
      <section className="relative overflow-hidden px-4 md:px-8 py-20 md:py-24 bg-gradient-hero">
        <div className="pointer-events-none absolute -right-20 top-12 h-64 w-64 rounded-full bg-yellow-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-8 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" />
        <FloatingSticker className="right-6 top-10 hidden md:block">
          <IconStar className="size-12" />
        </FloatingSticker>
        <div className="relative z-10 mx-auto max-w-7xl">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-black/55">как это работает</span>
          <h2 className="mt-2 mb-12 font-heading text-3xl font-black md:text-4xl">3 шага до крутого микса</h2>
          <div className="grid gap-6 md:gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Найди", desc: "Опиши звук словами — «скрип снега», «гудок метро»" },
              { n: "02", title: "Исказь", desc: "Lo-fi, «Страшно» или «Ностальгия» — один клик" },
              { n: "03", title: "Смиксуй", desc: "До 3 дорожек → скачай .m4a → в Reels или монтаж" },
            ].map((item, i) => (
              <div key={item.n} className="rounded-2xl border-2 border-white/60 bg-white/85 p-8 md:p-10 min-h-[220px] shadow-xl shadow-brand-orange/10 backdrop-blur flex flex-col transition-all hover:-translate-y-1 hover:bg-white hover:shadow-2xl hover:shadow-brand-orange/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-3xl font-black text-gradient-sunset">{item.n}</span>
                  {STEP_ICONS[i]}
                </div>
                <h3 className="font-heading text-lg font-black">{item.title}</h3>
                <p className="mt-3 text-sm font-medium text-brand-black/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mixer CTA */}
      <section className="relative overflow-hidden px-4 md:px-8 py-16 md:py-24 bg-brand-black text-white">
        <FloatingSticker className="left-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <IconVinyl className="size-20" />
        </FloatingSticker>
        <FloatingSticker className="right-12 top-12 hidden md:block" delay="0.8s">
          <IconHeadphones className="size-16" />
        </FloatingSticker>
        <div className="mx-auto max-w-7xl text-center relative z-10 space-y-6">
          <IconBolt className="size-14 mx-auto" />
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-brand-amber">микшер</p>
          <h2 className="font-heading text-3xl font-black md:text-5xl">Смешай свой саунд</h2>
          <p className="mx-auto max-w-md text-white/65 font-medium leading-relaxed">
            Добавь звук → крути пресет → скачай — идеально для pet-проектов и учёбы
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Lo-fi", "Страшно", "Ностальгия"].map((p, i) => (
              <span
                key={p}
                className={`font-mono text-xs font-bold px-4 py-2 rounded-full ${
                  i === 0 ? "bg-gradient-sunset-btn text-brand-black" : "border border-white/20 bg-white/10"
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

      {/* Footer CTA — бумажный фон */}
      <section className="relative px-4 md:px-8 py-16 md:py-24 text-center bg-background overflow-hidden border-t border-brand-orange/15">
        <div className="mx-auto max-w-7xl space-y-8 relative z-10">
          <IconStar className="size-12 mx-auto" />
          <h2 className="font-heading text-3xl font-black md:text-5xl tracking-tight">Залетай в архив</h2>
          <p className="font-medium text-brand-black/60">Бесплатно · без регистрации · CC0</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" onClick={randomSound}>
              <Shuffle className="h-4 w-4" />
              Случайный звук
            </Button>
            <Button size="lg" onClick={() => navigate("/search")}>
              Все звуки
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
