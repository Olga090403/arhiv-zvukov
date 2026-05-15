import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Plus, Search, SearchX, ArrowUpRight } from "lucide-react";
import { CATEGORIES, formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import type { DbSound } from "@/lib/database.types";
import { toast } from "sonner";

const TAG_COLORS: Record<string, string> = {
  Природа: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Город: "bg-amber-100 text-amber-700 border-amber-200",
  Техника: "bg-violet-100 text-violet-700 border-violet-200",
  Ностальгия: "bg-rose-100 text-rose-700 border-rose-200",
  Атмосфера: "bg-sky-100 text-sky-700 border-sky-200",
};

function getTagColor(tags: string[]): string {
  const cat = mapCategory(tags);
  return TAG_COLORS[cat] ?? "bg-secondary text-secondary-foreground border-border";
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [sounds, setSounds] = useState<DbSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQ);
    fetchSounds(initialQ, activeCategory);
  }, [initialQ, activeCategory]);

  async function fetchSounds(q: string, category: string) {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("sounds")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`title.ilike.%${q}%,tags.cs.{${q}}`);
    }

    const { data, error: err } = await query;

    if (err) {
      console.error("Supabase error:", err);
      setError("Не удалось загрузить звуки");
      toast.error("Ошибка загрузки");
    } else {
      let filtered = data ?? [];
      if (category && category !== "Все") {
        filtered = filtered.filter((s) => s.tags.some(
          (t) => t.toLowerCase() === category.toLowerCase()
            || mapCategory(s.tags) === category
        ));
      }
      setSounds(filtered);
    }
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParams(query.trim() ? { q: query.trim() } : {});
  }

  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
            Каталог
          </span>
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            {initialQ ? `«${initialQ}»` : "Все звуки"}
          </h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти звук…"
              className="pl-9 h-10"
            />
          </div>
          <Button type="submit" className="h-10 px-5">Найти</Button>
        </form>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {!loading && (
          <span className="font-mono text-xs text-muted-foreground shrink-0">
            {sounds.length} результат{sounds.length === 1 ? "" : sounds.length < 5 ? "а" : "ов"}
          </span>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchSounds(initialQ, activeCategory)}>
            Повторить
          </Button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Cards grid ── */}
      {!loading && !error && sounds.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {sounds.map((sound) => {
            const colorClass = getTagColor(sound.tags);
            return (
              <SoundCard
                key={sound.id}
                sound={sound}
                tagColorClass={colorClass}
                onNavigate={(path) => navigate(path)}
              />
            );
          })}
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && sounds.length === 0 && (
        <div className="flex flex-col items-center gap-6 py-24 text-center">
          <SearchX className="h-14 w-14 text-muted-foreground/20" />
          <div className="space-y-2">
            <p className="font-heading text-2xl font-bold">Ничего не найдено</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Попробуй другой запрос или сбрось фильтры.
            </p>
          </div>
          <Button variant="outline" className="rounded-full px-6" onClick={() => { setParams({}); setActiveCategory("Все"); }}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
}

/* ── Sound Card ── */

interface SoundCardProps {
  sound: DbSound;
  tagColorClass: string;
  onNavigate: (path: string) => void;
}

function SoundCard({ sound, tagColorClass, onNavigate }: SoundCardProps) {
  return (
    <article className="group cursor-pointer" onClick={() => onNavigate(`/sound/${sound.id}`)}>
      {/* Waveform visual — acts like the image area in the reference */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card transition-all group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5"
        style={{ borderTopLeftRadius: "2rem" }}
      >
        {/* Gradient bg based on sound */}
        <div
          className="absolute inset-0 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity"
          style={{
            background: `linear-gradient(135deg, 
              hsl(${(sound.id.charCodeAt(0) * 7) % 360} 60% 70%) 0%, 
              hsl(${(sound.id.charCodeAt(2) * 11) % 360} 50% 75%) 100%)`
          }}
        />

        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div className="flex h-16 w-full items-end gap-[3px]">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 25 + Math.sin(i * 0.5 + sound.id.charCodeAt(0) * 0.15) * 30
                + Math.cos(i * 0.3 + sound.id.charCodeAt(1) * 0.1) * 20;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-foreground/15 group-hover:bg-primary/50 transition-colors duration-300"
                  style={{ height: `${Math.max(12, h)}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Duration label */}
        <span className="absolute top-4 left-5 font-mono text-[11px] text-muted-foreground/60">
          {formatDuration(sound.duration)}
        </span>

        {/* License */}
        <span className="absolute top-4 right-5 font-mono text-[10px] text-muted-foreground/50 border border-border/60 rounded-full px-2 py-0.5">
          {sound.license}
        </span>

        {/* Round action button */}
        <button
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(`/sound/${sound.id}`);
          }}
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>

        {/* Play button center on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
            style={{ background: "var(--color-brand-amber)" }}
          >
            <Play className="h-5 w-5 ml-0.5 text-brand-black" />
          </div>
        </div>
      </div>

      {/* ── Card meta ── */}
      <div className="mt-4 space-y-2 px-1">
        <h3 className="font-heading text-base font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {sound.title}
        </h3>

        {sound.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {sound.description}
          </p>
        )}

        {!sound.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {sound.author} · {sound.tags.slice(0, 4).join(", ")}
          </p>
        )}

        {/* Colored tag badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sound.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tagColorClass}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="mt-3 flex gap-2 px-1">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 gap-1.5 text-xs h-9 rounded-full"
          onClick={(e) => { e.stopPropagation(); onNavigate(`/sound/${sound.id}`); }}
        >
          <Play className="h-3.5 w-3.5" />
          Слушать
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs h-9 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(`/mixer?add=${sound.id}&title=${encodeURIComponent(sound.title)}`);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          В микс
        </Button>
      </div>
    </article>
  );
}

function mapCategory(tags: string[]): string {
  const lower = tags.map((t) => t.toLowerCase());
  if (lower.some((t) => ["снег", "дождь", "ветер", "вода", "капель", "природа"].includes(t))) return "Природа";
  if (lower.some((t) => ["метро", "трамвай", "город", "улица", "транспорт"].includes(t))) return "Город";
  if (lower.some((t) => ["лампа", "машинка", "электричество", "техника"].includes(t))) return "Техника";
  if (lower.some((t) => ["советский", "ретро", "ностальгия", "старый"].includes(t))) return "Ностальгия";
  if (lower.some((t) => ["кофе", "утро", "атмосфера", "ночь", "интерьер"].includes(t))) return "Атмосфера";
  return "Все";
}
