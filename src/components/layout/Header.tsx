import { Link, NavLink } from "react-router-dom";
import { Heart, Upload, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoritesDrawer from "./FavoritesDrawer";

export default function Header() {
  const [query, setQuery] = useState("");
  const [favOpen, setFavOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-heading text-sm font-bold tracking-tight text-foreground md:text-base"
          >
            Архив&nbsp;звуков
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти звук…"
              className="h-9 max-w-sm bg-secondary"
            />
          </form>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            <NavLink to="/mixer">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                >
                  <Music2 className="h-4 w-4" />
                  <span className="hidden md:inline">Микшер</span>
                </Button>
              )}
            </NavLink>

            <NavLink to="/upload">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden md:inline">Загрузить</span>
                </Button>
              )}
            </NavLink>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setFavOpen(true)}
            >
              <Heart className="h-4 w-4" />
              <span className="hidden md:inline">Избранное</span>
            </Button>
          </nav>
        </div>
      </header>

      <FavoritesDrawer open={favOpen} onOpenChange={setFavOpen} />
    </>
  );
}
