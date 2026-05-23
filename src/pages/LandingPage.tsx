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

const MARQUEE_ITEMS = [
  "СКРИП СНЕГА", "✦", "МЕТРО 80-х", "✦", "СТАРАЯ ЛАМПА", "✦",
  "НОЧНОЙ ТРАМВАЙ", "✦", "ПИШУЩАЯ МАШИНКА", "✦", "КОФЕВАРКА", "✦",
  "КАПЕЛЬ С КРЫШИ", "✦", "ДИСКОВЫЙ ТЕЛЕФОН", "✦",
];

const CATEGORY_ICONS: Record<string, string> = {
  Природа: "❄",
  Город: "🚇",
  Техника: "💡",
  Ностальгия: "📼",
  Атмосфера: "🌙",
};

function WaveformBars({ seed, active }: { seed: number; active?: boolean }) {
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
          className={`flex-1 rounded-full transition-colors ${
            active ? "bg-brand-amber" : "bg-foreground/10"
          }`}
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
  const rotations = ["-rotate-[4deg]", "rotate-[3deg]", "-rotate-[1.5deg]"];
  const positions = [
    "top-0 left-0 z-30",
    "top-12 right-0 z-20",
    "bottom-0 left-[15%] z-10",
  ];

  return (
    <article
      className={`group absolute w-full max-w-[280px] cursor-pointer rounded-xl border border-border bg-card p-5 shadow-xl transition-transform hover:-translate-y-1 hover:rotate-0 ${positions[index]} ${rotations[index]}`}
      onClick={onClick}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {(sound.tags[0] ?? "архив").toLowerCase()}
      </span>
      <h3 className="mt-1 text-sm font-semibold leading-snug">{sound.title}</h3>
      <div className="mt-3">
        <WaveformBars seed={index * 1.7} />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-foreground">
        <Play className="h-3 w-3" />
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
        supabase
          .from("sounds")
          .select("*")
          .eq("status", "approved")
          .order("listen_count", { ascending: false })
          .limit(3),
        supabase
          .from("sounds")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),
      ]);

      if (featuredRes.error) {
        console.error("Supabase error:", featuredRes.error);
        setError("Не удалось загрузить звуки");
        toast.error("Ошибка загрузки данных");
      } else {
        setSounds(featuredRes.data ?? []);
      }

      if (!countRes.error && countRes.count != null) {
        setTotalCount(countRes.count);
      }

      setLoading(false);
    }
    fetchFeatured();
  }, []);

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <div className="flex flex-col gap-0 -mt-8">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 md:px-8 py-16 md:py-20 min-h-[min(88vh,900px)] flex flex-col justify-center">
        <div
          className="pointer-events-none absolute right-[-8%] top-[8%] h-[420px] w-[520px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(242, 201, 76, 0.22) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Бесплатно · без регистрации · CC0
            </p>

            <h1 className="font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
              Забытые
              <br />
              <span className="bg-brand-amber px-1 text-brand-black">звуки</span>
              <br />
              живут здесь
            </h1>

            <p className="mt-6 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
              Найди «скрип снега под валенком», искази пресетом Lo-fi и собери микс за&nbsp;2&nbsp;минуты — прямо в браузере.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-md items-center gap-3 rounded-full border border-border bg-card py-1.5 pl-4 pr-1.5 shadow-lg shadow-brand-black/5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="жужжание лампы, метро 80-х…"
                className="h-10 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <Button type="submit" className="rounded-full shrink-0">
                Найти
              </Button>
            </form>

            <div className="mt-4">
              <Button variant="outline" size="lg" className="rounded-full gap-2" onClick={randomSound}>
                <Shuffle className="h-4 w-4" />
                Случайный звук
              </Button>
            </div>

            <div className="mt-10 flex gap-10 border-t border-border pt-6">
              {[
                { value: totalCount ?? (loading ? "…" : sounds.length), label: "звуков в архиве" },
                { value: "3", label: "пресета" },
                { value: "0 ₽", label: "на старте" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold md:text-3xl tracking-tight">{stat.value}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[340px] lg:block">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-full max-w-[280px] rounded-xl border border-border bg-card p-5 ${["top-0 left-0", "top-12 right-0", "bottom-0 left-[15%]"][i]}`}
                  >
                    <SoundCardSkeleton />
                  </div>
                ))
              : sounds.map((sound, i) => (
                  <FloatCard
                    key={sound.id}
                    sound={sound}
                    index={i}
                    onClick={() => navigate(`/sound/${sound.id}`)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-card/60 py-4">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`mx-5 font-heading text-2xl font-bold md:text-4xl ${
                item === "✦" ? "text-brand-amber" : "text-foreground/10"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Featured — mobile + fallback */}
      <section className="px-4 md:px-8 py-16 lg:hidden">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
              Избранное из архива
            </span>
            <h2 className="mt-2 font-heading text-3xl font-bold">Послушай прямо сейчас</h2>
          </div>
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <SoundCardSkeleton key={i} />)
              : sounds.map((sound) => (
                  <article
                    key={sound.id}
                    className="cursor-pointer rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-amber"
                    onClick={() => navigate(`/sound/${sound.id}`)}
                  >
                    <h3 className="font-medium">{sound.title}</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{formatDuration(sound.duration)}</span>
                      <span>·</span>
                      <span>{sound.author}</span>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 md:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">Каталог</span>
          <h2 className="mt-2 mb-8 font-heading text-3xl font-bold md:text-4xl">
            Исчезающие звуки по категориям
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {CATEGORIES.filter((c) => c !== "Все").map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                className="rounded-xl border border-border bg-card py-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-amber"
              >
                <div className="text-2xl mb-2">{CATEGORY_ICONS[cat] ?? "🔊"}</div>
                <div className="text-sm font-semibold">{cat}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-8 py-16 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
            Как это работает
          </span>
          <h2 className="mt-2 mb-10 font-heading text-3xl font-bold md:text-4xl">
            От поиска до микса за 2 минуты
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "01", title: "Найди", desc: "Опиши звук словами или выбери из категорий — без переслушивания сотен файлов." },
              { n: "02", title: "Исказь", desc: "Один клик: Lo-fi, «Страшно» или «Ностальгия» — без Audacity и Ableton." },
              { n: "03", title: "Смиксуй", desc: "До 3 дорожек в браузере, скачай .m4a и отдай в проект или Reels." },
            ].map((item) => (
              <div key={item.n} className="space-y-3">
                <span className="font-heading text-4xl font-extrabold text-brand-amber">{item.n}</span>
                <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mixer band — violet zone */}
      <section className="relative overflow-hidden bg-brand-black px-4 md:px-8 py-20 text-[#EDEDEF]">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124, 92, 255, 0.25) 0%, transparent 65%)" }}
        />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-violet mb-4">
            Диджей-пульт для забытых звуков
          </p>
          <h2 className="font-heading text-3xl font-extrabold md:text-5xl tracking-tight mb-4">
            Попробуй микшер
          </h2>
          <p className="mx-auto max-w-md text-[#EDEDEF]/65 mb-8">
            Добавь звук → крути пресет → скачай. Момент «ага!» за 60 секунд.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Lo-fi", "Страшно", "Ностальгия"].map((p, i) => (
              <span
                key={p}
                className={`font-mono text-xs px-4 py-2 rounded-full border ${
                  i === 0
                    ? "border-brand-violet bg-brand-violet/20 text-white"
                    : "border-white/15 bg-white/5 text-[#EDEDEF]/80"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
          <Button
            size="lg"
            className="rounded-full gap-2 bg-brand-violet text-white hover:bg-brand-violet/90 shadow-lg shadow-brand-violet/30"
            onClick={() => navigate("/mixer")}
          >
            Открыть микшер
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-4 md:px-8 py-20 text-center border-t border-border">
        <div className="mx-auto max-w-7xl space-y-6">
          <h2 className="font-heading text-3xl font-extrabold md:text-4xl tracking-tight">
            Начни с одного звука
          </h2>
          <p className="text-muted-foreground">Бесплатно. Без регистрации. Для учебных проектов и Reels.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" className="rounded-full gap-2" onClick={randomSound}>
              <Shuffle className="h-4 w-4" />
              Случайный звук
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full gap-2"
              onClick={() => navigate("/search")}
            >
              Открыть архив
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
