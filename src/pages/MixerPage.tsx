import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Square, Download, Plus, X, Search } from "lucide-react";
import { getSoundById, formatDuration } from "@/lib/mockData";
import { toast } from "sonner";

interface Track {
  id: string;
  title: string;
  duration: number;
  volume: number;
}

interface Preset {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

const PRESETS: Preset[] = [
  { id: "slow", emoji: "🐢", label: "Замедлить", description: "×0.7 tempo, тёмный вайб" },
  { id: "film", emoji: "🎞️", label: "Шум плёнки", description: "Lo-fi, винил, тепло" },
  { id: "reverse", emoji: "⏪", label: "Реверс", description: "Зеркало звука" },
];

const MAX_TRACKS = 3;

export default function MixerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  // Add sound from URL param (?add=id&title=...)
  useEffect(() => {
    const addId = searchParams.get("add");
    const addTitle = searchParams.get("title");
    if (!addId) return;

    const sound = getSoundById(addId);
    if (!sound) return;

    setTracks((prev) => {
      if (prev.some((t) => t.id === addId)) {
        toast.info("Этот звук уже в миксе");
        return prev;
      }
      if (prev.length >= MAX_TRACKS) {
        toast.warning(`Максимум ${MAX_TRACKS} дорожки`);
        return prev;
      }
      return [
        ...prev,
        { id: addId, title: addTitle ?? sound.title, duration: sound.duration, volume: 80 },
      ];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeTrack(id: string) {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  function setVolume(id: string, volume: number) {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, volume } : t))
    );
  }

  function handleExport() {
    if (tracks.length === 0) {
      toast.error("Добавь хотя бы один звук в микс");
      return;
    }
    toast.success("Экспорт .m4a — подключим в Слой 2 (Web Audio API + MediaRecorder)");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold">Диджей-микшер</h1>
        <p className="text-muted-foreground text-sm">
          До {MAX_TRACKS} дорожек · пресеты искажений · экспорт .m4a
        </p>
      </div>

      {/* Tracks */}
      <div className="space-y-3">
        {tracks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
            <p className="text-muted-foreground text-sm">Микс пуст</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/search")}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Найти звук
            </Button>
          </div>
        )}

        {tracks.map((track, idx) => (
          <Card key={track.id}>
            <CardContent className="flex items-center gap-4 p-4">
              {/* Track number */}
              <span
                className="font-mono text-xs font-bold shrink-0 w-5 text-center"
                style={{ color: "var(--color-brand-amber)" }}
              >
                {idx + 1}
              </span>

              {/* Mini waveform */}
              <div className="flex h-10 w-24 shrink-0 items-center gap-0.5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full bg-muted"
                    style={{ height: `${30 + Math.sin(i * 0.8 + Number(track.id)) * 22}%` }}
                  />
                ))}
              </div>

              {/* Title + duration */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.title}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDuration(track.duration)}
                </p>
              </div>

              {/* Volume slider */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs text-muted-foreground w-7 text-right">
                  {track.volume}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={track.volume}
                  onChange={(e) => setVolume(track.id, Number(e.target.value))}
                  className="w-24 accent-[#F2C94C]"
                />
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => removeTrack(track.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Add track button */}
        {tracks.length < MAX_TRACKS && tracks.length > 0 && (
          <Button
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() => navigate("/search")}
          >
            <Plus className="h-4 w-4" />
            Добавить дорожку ({tracks.length}/{MAX_TRACKS})
          </Button>
        )}
      </div>

      <Separator />

      {/* Presets */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Пресеты искажений</p>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePreset(activePreset === p.id ? null : p.id)}
              className={`rounded-xl border p-4 text-left transition-all space-y-1 ${
                activePreset === p.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <p className="font-medium text-sm">{p.label}</p>
              <p
                className={`text-xs ${
                  activePreset === p.id ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {p.description}
              </p>
            </button>
          ))}
        </div>
        {activePreset && (
          <div className="flex items-center gap-2">
            <Badge className="font-mono text-xs">
              {PRESETS.find((p) => p.id === activePreset)?.emoji}{" "}
              {PRESETS.find((p) => p.id === activePreset)?.label}
            </Badge>
            <span className="text-xs text-muted-foreground">применён</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2"
          onClick={() => setPlaying((p) => !p)}
          disabled={tracks.length === 0}
        >
          {playing ? (
            <><Square className="h-5 w-5" />Стоп</>
          ) : (
            <><Play className="h-5 w-5 ml-0.5" />Воспроизвести</>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="gap-2"
          onClick={handleExport}
        >
          <Download className="h-5 w-5" />
          Скачать (.m4a)
        </Button>
      </div>
    </div>
  );
}
