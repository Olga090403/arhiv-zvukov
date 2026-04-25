import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FavoritesDrawer({ open, onOpenChange }: Props) {
  // MVP: favorites stored in localStorage — populated in SoundPage
  const raw = localStorage.getItem("favorites");
  const favorites: { id: string; title: string }[] = raw ? JSON.parse(raw) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-heading text-base">
            <Heart className="h-4 w-4 text-primary" />
            Избранное
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-2">
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Пока пусто — нажми ❤ на странице звука.
            </p>
          ) : (
            favorites.map((s) => (
              <a
                key={s.id}
                href={`/sound/${s.id}`}
                className="block rounded-md px-3 py-2 text-sm hover:bg-secondary"
              >
                {s.title}
              </a>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
