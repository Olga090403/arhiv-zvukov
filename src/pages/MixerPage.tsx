import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Square, Download, Plus, X, Search } from "lucide-react";
import { formatDuration } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { t } from "@/lib/typography";

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
  { id: "slow", emoji: "🐢", label: "Замедлить", description: "×0.7 tempo" },
  { id: "film", emoji: "🎞️", label: "Шум плёнки", description: "Lo-fi, винил" },
  { id: "reverse", emoji: "⏪", label: "Реверс", description: "Зеркало звука" },
];

const MAX_TRACKS = 3;

export default function MixerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const addId = searchParams.get("add");
    const addTitle = searchParams.get("title");
    if (!addId) return;

    async function addTrack() {
      const { data: sound } = await supabase
        .from("sounds")
        .select("id, title, duration")
        .eq("id", addId!)
        .single();

      setTracks((prev) => {
        if (prev.some((t) => t.id === addId)) {
          toast.info(t("Этот звук уже в миксе"));
          return prev;
        }
        if (prev.length >= MAX_TRACKS) {
          toast.warning(t(`Максимум ${MAX_TRACKS} дорожки`));
          return prev;
        }
        return [
          ...prev,
          {
            id: addId!,
            title: addTitle ?? sound?.title ?? "Звук",
            duration: sound?.duration ?? 0,
            volume: 80,
          },
        ];
      });
    }
    addTrack();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeTrack(id: string) {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  function setVolume(id: string, volume: number) {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, volume } : t)));
  }

  function handleExport() {
    if (tracks.length === 0) {
      toast.error(t("Добавь хотя бы один звук"));
      return;
    }
    toast.success(t("Экспорт .m4a — подключим в Слой 2"));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
          Микшер
        </span>
        <h1 className="font-heading text-3xl font-bold md:text-4xl">Диджей-пульт</h1>
        <p className="text-muted-foreground text-sm">
          До {MAX_TRACKS} дорожек · {PRESETS.length} пресета · экспорт .m4a
        </p>
      </div>

      {/* Tracks */}
      <div className="space-y-3">
        {tracks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border py-16 text-center">
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold">Микс пуст</p>
              <p className="text-sm text-muted-foreground">
                {t("Добавь звуки из каталога, чтобы начать")}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/search")} className="gap-2">
              <Search className="h-4 w-4" />
              Найти звуки
            </Button>
          </div>
        )}

        {tracks.map((track, idx) => (
          <div
            key={track.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:shadow-sm"
          >
            {/* Number */}
            <span
              className="font-heading text-2xl font-bold w-6 text-center shrink-0"
              style={{ color: "var(--color-brand-amber)" }}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Waveform */}
            <div className="hidden sm:flex h-10 w-28 shrink-0 items-end gap-[2px]">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-foreground/10"
                  style={{ height: `${25 + Math.sin(i * 0.8 + Number(track.id)) * 22}%` }}
                />
              ))}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {formatDuration(track.duration)}
              </p>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-xs text-muted-foreground w-7 text-right">
                {track.volume}
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={track.volume}
                onChange={(e) => setVolume(track.id, Number(e.target.value))}
                className="w-20 accent-[#F2C94C]"
              />
            </div>

            {/* Remove */}
            <button
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => removeTrack(track.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {tracks.length > 0 && tracks.length < MAX_TRACKS && (
          <Button
            variant="outline"
            className="w-full gap-2 border-dashed h-12"
            onClick={() => navigate("/search")}
          >
            <Plus className="h-4 w-4" />
            Добавить дорожку ({tracks.length}/{MAX_TRACKS})
          </Button>
        )}
      </div>

      <Separator />

      {/* Presets */}
      <div className="space-y-4">
        <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
          Пресеты искажений
        </span>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePreset(activePreset === p.id ? null : p.id)}
              className={`rounded-xl border p-5 text-left transition-all space-y-2 ${
                activePreset === p.id
                  ? "border-primary bg-foreground text-background shadow-md"
                  : "border-border bg-card hover:border-foreground/30"
              }`}
            >
              <span className="text-3xl block">{p.emoji}</span>
              <p className="font-medium text-sm">{p.label}</p>
              <p
                className={`text-xs ${
                  activePreset === p.id ? "text-background/60" : "text-muted-foreground"
                }`}
              >
                {p.description}
              </p>
            </button>
          ))}
        </div>
        {activePreset && (
          <Badge className="font-mono text-xs">
            {PRESETS.find((p) => p.id === activePreset)?.emoji}{" "}
            {PRESETS.find((p) => p.id === activePreset)?.label} — применён
          </Badge>
        )}
      </div>

      <Separator />

      {/* Play / Export */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 gap-2 h-14 text-base"
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
          className="gap-2 h-14"
          onClick={handleExport}
        >
          <Download className="h-5 w-5" />
          .m4a
        </Button>
      </div>
    </div>
  );
}
