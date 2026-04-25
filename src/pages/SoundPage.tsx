import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Plus, Download, Play, ArrowLeft } from "lucide-react";
import { getSoundById, MOCK_SOUNDS, formatDuration } from "@/lib/mockData";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

export default function SoundPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add, remove, isFav } = useFavorites();

  const sound = id ? getSoundById(id) : undefined;

  if (!sound) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-2xl font-heading font-bold">Звук не найден</p>
        <Button variant="outline" onClick={() => navigate("/search")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Вернуться к поиску
        </Button>
      </div>
    );
  }

  const favorited = isFav(sound.id);
  const similar = MOCK_SOUNDS.filter(
    (s) => s.id !== sound.id && s.category === sound.category
  ).slice(0, 3);

  function toggleFav() {
    if (favorited) {
      remove(sound!.id);
      toast("Удалено из избранного");
    } else {
      add({ id: sound!.id, title: sound!.title, author: sound!.author, duration: sound!.duration });
      toast.success("Добавлено в избранное ❤");
    }
  }

  function addToMixer() {
    navigate(`/mixer?add=${sound!.id}&title=${encodeURIComponent(sound!.title)}`);
    toast.success("Звук добавлен в микшер");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-1.5 -ml-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </Button>

      {/* Title */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="font-mono text-xs">
            {sound.category}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            {sound.license}
          </Badge>
        </div>
        <h1 className="font-heading text-3xl font-bold leading-tight">
          {sound.title}
        </h1>
        <p className="text-muted-foreground">{sound.description}</p>
      </div>

      {/* Waveform placeholder */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex h-20 items-center gap-0.5">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-muted"
              style={{
                height: `${30 + Math.sin(i * 0.4) * 28 + Math.cos(i * 0.15) * 16}%`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span>0:00</span>
          <Button size="icon" className="h-10 w-10 rounded-full">
            <Play className="h-4 w-4 ml-0.5" />
          </Button>
          <span>{formatDuration(sound.duration)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={addToMixer} className="gap-2">
          <Plus className="h-4 w-4" />
          В микс
        </Button>
        <Button
          variant={favorited ? "default" : "outline"}
          onClick={toggleFav}
          className="gap-2"
          style={favorited ? { background: "var(--color-brand-amber)", color: "var(--color-brand-black)" } : {}}
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
          {favorited ? "В избранном" : "Избранное"}
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Скачать оригинал
        </Button>
      </div>

      {/* Meta */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="font-heading text-sm font-semibold">Метаданные</h3>
        <Separator />
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Автор</dt>
          <dd className="font-medium">{sound.author}</dd>
          <dt className="text-muted-foreground">Лицензия</dt>
          <dd>
            <Badge variant="outline" className="font-mono text-xs">
              {sound.license}
            </Badge>
          </dd>
          <dt className="text-muted-foreground">Длительность</dt>
          <dd className="font-mono">{formatDuration(sound.duration)}</dd>
          <dt className="text-muted-foreground">Категория</dt>
          <dd>{sound.category}</dd>
          <dt className="text-muted-foreground">Прослушиваний</dt>
          <dd className="font-mono">{sound.listenCount.toLocaleString()}</dd>
        </dl>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {sound.tags.map((tag) => (
          <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`}>
            <Badge
              variant="secondary"
              className="font-mono text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              #{tag}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Similar sounds */}
      {similar.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <h3 className="font-heading text-lg font-semibold">Похожие звуки</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {similar.map((s) => (
              <Card
                key={s.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/sound/${s.id}`)}
              >
                <CardContent className="p-3 space-y-1">
                  <p className="text-sm font-medium line-clamp-2">{s.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatDuration(s.duration)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
