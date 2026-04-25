import { Button } from "@/components/ui/button";
import { Download, Play } from "lucide-react";

const PRESETS = [
  { id: "slow", emoji: "🐢", label: "Замедлить" },
  { id: "film", emoji: "🎞️", label: "Шум плёнки" },
  { id: "reverse", emoji: "⏪", label: "Реверс" },
];

export default function MixerPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="font-heading text-3xl font-bold">Диджей-микшер</h1>

      {/* Tracks — up to 3, §11 Must Have */}
      <div className="space-y-3">
        {[1, 2, 3].map((track) => (
          <div
            key={track}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
          >
            <span className="font-mono text-xs text-muted-foreground w-6">
              {track}
            </span>
            <div className="flex-1 h-12 rounded bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                Дорожка {track} — добавь звук из поиска
              </span>
            </div>
            {/* Volume slider placeholder */}
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={80}
              className="w-24 accent-brand-amber"
            />
          </div>
        ))}
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Пресеты искажений</p>
        <div className="flex gap-3">
          {PRESETS.map((p) => (
            <Button key={p.id} variant="outline" className="gap-2 flex-1">
              <span>{p.emoji}</span>
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button size="lg" className="gap-2 flex-1">
          <Play className="h-5 w-5" />
          Воспроизвести
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Download className="h-5 w-5" />
          Скачать микс (.m4a)
        </Button>
      </div>

      <p className="text-xs text-muted-foreground font-mono">
        Web Audio API + MediaRecorder → audio/mp4 (.m4a) подключим в Слой 2
      </p>
    </div>
  );
}
