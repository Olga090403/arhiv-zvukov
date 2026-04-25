import { useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Природа", "Город", "Техника", "Ностальгия", "Атмосфера"];

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold">
          {q ? `Результаты: «${q}»` : "Все звуки"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Поиск по названию и тегам
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-secondary">
            {cat}
          </Badge>
        ))}
      </div>

      {/* Results grid — populated in Layer 2 (Supabase) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-4 space-y-2"
          >
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
            <div className="flex gap-1 pt-1">
              <div className="h-5 w-12 rounded-full bg-muted animate-pulse" />
              <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
