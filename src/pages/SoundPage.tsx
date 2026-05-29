import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Plus, Download, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import type { DbSound } from "@/lib/database.types";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { t } from "@/lib/typography";

export default function SoundPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add, remove, isFav } = useFavorites();

  const [sound, setSound] = useState<DbSound | null>(null);
  const [similar, setSimilar] = useState<DbSound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const soundId = id;
    async function fetchSound() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("sounds")
        .select("*")
        .eq("id", soundId)
        .single();

      if (err || !data) {
        console.error("Supabase error:", err);
        setError(t("Звук не найден"));
        setLoading(false);
        return;
      }

      setSound(data);

      // fetch similar by first tag
      if (data.tags.length > 0) {
        const { data: sim } = await supabase
          .from("sounds")
          .select("*")
          .eq("status", "approved")
          .neq("id", soundId)
          .contains("tags", [data.tags[0]])
          .limit(3);
        setSimilar(sim ?? []);
      }

      setLoading(false);
    }
    fetchSound();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-full max-w-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-40" />
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
    );
  }

  if (error || !sound) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-heading text-3xl font-bold">Звук не найден</p>
        <p className="text-muted-foreground">{t("Возможно, он уже исчез навсегда")}</p>
        <Button variant="outline" onClick={() => navigate("/search")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Вернуться к поиску
        </Button>
      </div>
    );
  }

  const favorited = isFav(sound.id);

  function toggleFav() {
    if (favorited) {
      remove(sound!.id);
      toast(t("Удалено из избранного"));
    } else {
      add({ id: sound!.id, title: sound!.title, author: sound!.author, duration: sound!.duration });
      toast.success(t("Добавлено в избранное ❤"));
    }
  }

  function addToMixer() {
    navigate(`/mixer?add=${sound!.id}&title=${encodeURIComponent(sound!.title)}`);
    toast.success(t("Звук добавлен в микшер"));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors -mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </button>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono text-xs tracking-wider">
          {sound.tags[0] ?? "звук"}
        </Badge>
        <Badge variant="secondary" className="font-mono text-xs">{sound.license}</Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {sound.listen_count.toLocaleString()} прослушиваний
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
          {sound.title}
        </h1>
        {sound.description && (
          <p className="text-lg text-muted-foreground">{sound.description}</p>
        )}
      </div>

      {/* Waveform */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8">
        <div className="gradient-blob -top-32 -right-32 opacity-20" />
        <div className="relative z-10 flex h-28 items-end gap-[2px]">
          {Array.from({ length: 100 }).map((_, i) => {
            const h = 25 + Math.sin(i * 0.35) * 28 + Math.cos(i * 0.12) * 18;
            return (
              <div
                key={i}
                className="flex-1 rounded-full bg-foreground/12 hover:bg-primary/60 transition-colors cursor-pointer"
                style={{ height: `${Math.max(6, h)}%` }}
              />
            );
          })}
        </div>
        <div className="relative z-10 mt-6 flex items-center justify-between">
          <span className="font-mono text-sm text-muted-foreground">0:00</span>
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <Play className="h-6 w-6 ml-0.5" />
          </Button>
          <span className="font-mono text-sm text-muted-foreground">
            {formatDuration(sound.duration)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button size="lg" onClick={addToMixer} className="gap-2 flex-1 sm:flex-none">
          <Plus className="h-4 w-4" />
          Добавить в микс
        </Button>
        <Button
          size="lg"
          variant={favorited ? "default" : "outline"}
          onClick={toggleFav}
          className="gap-2"
          style={favorited ? { background: "var(--color-brand-amber)", color: "var(--color-brand-black)" } : {}}
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
          {favorited ? "В избранном" : "Избранное"}
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Скачать
        </Button>
      </div>

      <Separator />

      {/* Meta */}
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Автор", value: sound.author },
          { label: "Лицензия", value: sound.license },
          { label: "Длительность", value: formatDuration(sound.duration), mono: true },
          { label: "Прослушиваний", value: sound.listen_count.toLocaleString(), mono: true },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-1">
              {item.label}
            </p>
            <p className={`font-medium ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Tags */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Теги</p>
        <div className="flex flex-wrap gap-2">
          {sound.tags.map((tag) => (
            <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`}>
              <Badge
                variant="outline"
                className="font-mono text-xs px-3 py-1 cursor-pointer hover:bg-foreground hover:text-background transition-all"
              >
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <>
          <Separator />
          <div className="space-y-6">
            <h3 className="font-heading text-xl font-semibold">Похожие звуки</h3>
            <div className="space-y-2">
              {similar.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-4 rounded-xl border border-border p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate(`/sound/${s.id}`)}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                    <Play className="h-4 w-4 ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatDuration(s.duration)} · {s.author}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
