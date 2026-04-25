import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Upload, Music2, Search } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import FavoritesDrawer from "./FavoritesDrawer";

export default function Header() {
  const [query, setQuery] = useState("");
  const [favOpen, setFavOpen] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    ].join(" ");

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-heading text-sm font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span style={{ color: "var(--color-brand-amber)" }}>▶</span>
            &nbsp;Архив звуков
          </Link>

          {/* Search — центральный элемент */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2 max-w-sm"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти звук…"
                className="h-8 pl-8 text-sm bg-secondary border-transparent focus:border-border"
              />
            </div>
          </form>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/mixer" className={navLinkClass}>
              <Music2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Микшер</span>
            </NavLink>

            <NavLink to="/upload" className={navLinkClass}>
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Загрузить</span>
            </NavLink>

            {/* Favorites button with counter */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 relative"
              onClick={() => setFavOpen(true)}
            >
              <Heart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Избранное</span>
              {favorites.length > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground"
                  style={{ background: "var(--color-brand-amber)", color: "var(--color-brand-black)" }}
                >
                  {favorites.length}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </header>

      <FavoritesDrawer open={favOpen} onOpenChange={setFavOpen} />
    </>
  );
}
