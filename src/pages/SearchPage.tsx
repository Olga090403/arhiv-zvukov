import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Plus, Search, SearchX } from "lucide-react";
import { IconWave, IconVinyl } from "@/components/DecorativeIcons";
import { CATEGORIES, formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import type { DbSound } from "@/lib/database.types";
import SoundCardSkeleton from "@/components/SoundCardSkeleton";
import { toast } from "sonner";
import { t } from "@/lib/typography";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState(params.get("category") ?? "Все");
  const [sounds, setSounds] = useState<DbSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuery(initialQ);
    const cat = params.get("category");
    if (cat) setActiveCategory(cat);
  }, [initialQ, params]);

  useEffect(() => {
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
      setError(t("Не удалось загрузить звуки"));
      toast.error(t("Ошибка загрузки"));
    } else {
      let filtered = (data ?? []) as DbSound[];
      if (category && category !== "Все") {
        filtered = filtered.filter((s) => s.tags.some(
          (t: string) => t.toLowerCase() === category.toLowerCase()
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
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <IconVinyl className="absolute -top-2 right-0 size-12 opacity-40 hidden sm:block pointer-events-none" aria-hidden />
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <IconWave className="w-14 h-6 opacity-70 hidden md:block shrink-0" aria-hidden />
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-brand-orange font-bold">
              Каталог
            </span>
          </div>
          <h1 className="font-heading text-3xl font-black md:text-4xl">
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
          <Button type="submit" className="h-10 px-4">Найти</Button>
        </form>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "border-2 border-transparent btn-sunset-gradient btn-sunset-gradient--bleed text-brand-black shadow-sm shadow-black/10"
                  : "border-brand-orange/30 bg-white text-muted-foreground hover:border-brand-orange hover:text-foreground"
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

      <Separator />

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => fetchSounds(initialQ, activeCategory)}>
            Повторить
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SoundCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && !error && sounds.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sounds.map((sound) => (
            <article
              key={sound.id}
              className="group cursor-pointer space-y-3"
              onClick={() => navigate(`/sound/${sound.id}`)}
            >
              <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/5">
                <div className="flex h-14 items-end gap-[2px]">
                  {Array.from({ length: 36 }).map((_, i) => {
                    const h = 20 + Math.sin(i * 0.6 + sound.id.charCodeAt(0) * 0.1) * 25
                      + Math.cos(i * 0.25) * 12;
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                    <Play className="h-4 w-4 ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1 px-0.5">
                <p className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {sound.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{formatDuration(sound.duration)}</span>
                  <span>·</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                    {sound.license}
                  </Badge>
                </div>
                <div className="flex gap-1.5 pt-0.5">
                  {sound.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="font-mono text-[10px] text-muted-foreground/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 px-0.5">
                <Button
                  size="sm" variant="ghost" className="flex-1 gap-1.5 text-xs h-8"
                  onClick={(e) => { e.stopPropagation(); navigate(`/sound/${sound.id}`); }}
                >
                  <Play className="h-3 w-3" />
                  Слушать
                </Button>
                <Button
                  size="sm" variant="outline" className="gap-1.5 text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/mixer?add=${sound.id}&title=${encodeURIComponent(sound.title)}`);
                  }}
                >
                  <Plus className="h-3 w-3" />
                  В микс
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && sounds.length === 0 && (
        <div className="flex flex-col items-center gap-5 py-20 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/30" />
          <div className="space-y-2">
            <p className="font-heading text-xl font-bold">Ничего не найдено</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("Попробуй другой запрос или сбрось фильтры.")}
            </p>
          </div>
          <Button variant="outline" onClick={() => { setParams({}); setActiveCategory("Все"); }}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
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
