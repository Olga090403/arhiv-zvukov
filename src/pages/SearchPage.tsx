import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Play, Plus, Search, SearchX } from "lucide-react";
import { MOCK_SOUNDS, CATEGORIES, formatDuration, searchSounds } from "@/lib/mockData";
import SoundCardSkeleton from "@/components/SoundCardSkeleton";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQ = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuery(initialQ);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [initialQ]);

  const results = useMemo(
    () => searchSounds(initialQ, activeCategory),
    [initialQ, activeCategory]
  );

  const similar = useMemo(
    () => (results.length === 0 ? MOCK_SOUNDS.slice(0, 3) : []),
    [results]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParams(query.trim() ? { q: query.trim() } : {});
  }

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию и тегам…"
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className="cursor-pointer select-none px-3 py-1 text-sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Heading */}
      <div className="space-y-0.5">
        <h2 className="font-heading text-2xl font-semibold">
          {initialQ ? `«${initialQ}»` : "Все звуки"}
        </h2>
        {!loading && (
          <p className="text-sm text-muted-foreground">
            {results.length > 0
              ? `${results.length} звук${results.length === 1 ? "" : results.length < 5 ? "а" : "ов"}`
              : "Ничего не найдено"}
          </p>
        )}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SoundCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((sound) => (
            <SoundCard
              key={sound.id}
              sound={sound}
              onOpen={() => navigate(`/sound/${sound.id}`)}
              onAddToMixer={() =>
                navigate(`/mixer?add=${sound.id}&title=${encodeURIComponent(sound.title)}`)
              }
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <SearchX className="h-12 w-12 text-muted-foreground/40" />
          <div className="space-y-1">
            <p className="font-heading text-lg font-semibold">Ничего не найдено</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Попробуй другой запрос или выбери категорию.
              Архив пополняется — скоро здесь будет больше звуков.
            </p>
          </div>
          <Button variant="outline" onClick={() => { setParams({}); setActiveCategory("Все"); }}>
            Сбросить фильтры
          </Button>
        </div>
      )}

      {/* Similar block when no results */}
      {!loading && similar.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-semibold">
              Похожие звуки
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {similar.map((sound) => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  onOpen={() => navigate(`/sound/${sound.id}`)}
                  onAddToMixer={() =>
                    navigate(`/mixer?add=${sound.id}&title=${encodeURIComponent(sound.title)}`)
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SoundCardProps {
  sound: ReturnType<typeof searchSounds>[0];
  onOpen: () => void;
  onAddToMixer: () => void;
}

function SoundCard({ sound, onOpen, onAddToMixer }: SoundCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-colors hover:border-primary"
      onClick={onOpen}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex h-10 items-center gap-0.5">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-muted group-hover:bg-primary/30 transition-colors"
              style={{ height: `${25 + Math.sin(i * 0.9 + Number(sound.id)) * 18}%` }}
            />
          ))}
        </div>

        <div className="space-y-1">
          <p className="font-medium text-sm leading-snug line-clamp-2">
            {sound.title}
          </p>
          <div className="flex flex-wrap gap-1 pt-0.5">
            {sound.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="font-mono text-[10px] text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{formatDuration(sound.duration)}</span>
            <span>·</span>
            <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
              {sound.license}
            </Badge>
            <span>·</span>
            <span>{sound.listenCount} прослушиваний</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground text-xs"
            onClick={(e) => { e.stopPropagation(); onOpen(); }}
          >
            <Play className="h-3 w-3" />
            Открыть
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={(e) => { e.stopPropagation(); onAddToMixer(); }}
          >
            <Plus className="h-3 w-3" />
            В микс
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
