import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Download } from "lucide-react";

export default function SoundPage() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Sound header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold">Звук #{id}</h1>
        <p className="text-muted-foreground">
          Описание и контекст записи появятся здесь (Слой 2 — Supabase).
        </p>
      </div>

      {/* Waveform placeholder — Wavesurfer.js подключим в Layer 2 */}
      <div className="flex h-28 items-center justify-center rounded-lg border border-border bg-card">
        <span className="font-mono text-xs text-muted-foreground">
          Волновая форма (Wavesurfer.js) — Слой 2
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          В микс
        </Button>
        <Button variant="outline" className="gap-2">
          <Heart className="h-4 w-4" />
          Избранное
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Скачать оригинал
        </Button>
      </div>

      {/* Meta */}
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Автор</dt>
        <dd>—</dd>
        <dt className="text-muted-foreground">Лицензия</dt>
        <dd><Badge variant="outline">CC0</Badge></dd>
        <dt className="text-muted-foreground">Длительность</dt>
        <dd className="font-mono">0:00</dd>
      </dl>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {["снег", "зима", "полевая запись"].map((tag) => (
          <Badge key={tag} variant="secondary" className="font-mono text-xs">
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
