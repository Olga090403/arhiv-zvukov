import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { formatDuration } from "@/lib/mockData";
import { t } from "@/lib/typography";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FavoritesDrawer({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { favorites, remove } = useFavorites();

  function openSound(id: string) {
    onOpenChange(false);
    navigate(`/sound/${id}`);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-80 flex-col gap-0 p-0">
        <SheetHeader className="p-4 pb-3">
          <SheetTitle className="flex items-center gap-2 font-heading text-base">
            <Heart className="h-4 w-4" style={{ color: "var(--color-brand-amber)" }} />
            Избранное
            {favorites.length > 0 && (
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {favorites.length}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Heart className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {t("Пока пусто. Нажми ❤ на странице звука, чтобы добавить.")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((sound) => (
                <div
                  key={sound.id}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary transition-colors"
                >
                  <button
                    className="flex-1 text-left min-w-0"
                    onClick={() => openSound(sound.id)}
                  >
                    <p className="text-sm font-medium truncate">{sound.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {sound.author} · {formatDuration(sound.duration)}
                    </p>
                  </button>

                  <button
                    onClick={() => openSound(sound.id)}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => remove(sound.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <>
            <Separator />
            <div className="p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={() => {
                  favorites.forEach((s) => remove(s.id));
                }}
              >
                Очистить всё
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
