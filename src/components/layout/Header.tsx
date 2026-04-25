import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Heart, Upload, Music2, Search, Menu, X } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import FavoritesDrawer from "./FavoritesDrawer";

export default function Header() {
  const [query, setQuery] = useState("");
  const [favOpen, setFavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setMenuOpen(false);
  }

  function navTo(path: string) {
    navigate(path);
    setMenuOpen(false);
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    ].join(" ");

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-foreground hover:bg-secondary",
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

          {/* Search — hidden on mobile, visible sm+ */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 items-center gap-2 max-w-sm"
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

          {/* Spacer on mobile */}
          <div className="flex-1 sm:hidden" />

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden sm:flex items-center gap-1">
            <NavLink to="/mixer" className={navLinkClass}>
              <Music2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Микшер</span>
            </NavLink>

            <NavLink to="/upload" className={navLinkClass}>
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Загрузить</span>
            </NavLink>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 relative"
              onClick={() => setFavOpen(true)}
            >
              <Heart className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Избранное</span>
              {favorites.length > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ background: "var(--color-brand-amber)", color: "var(--color-brand-black)" }}
                >
                  {favorites.length}
                </span>
              )}
            </Button>
          </nav>

          {/* Favorites button — mobile only (outside burger for quick access) */}
          <Button
            variant="ghost"
            size="icon"
            className="relative sm:hidden h-9 w-9"
            onClick={() => setFavOpen(true)}
          >
            <Heart className="h-4 w-4" />
            {favorites.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "var(--color-brand-amber)", color: "var(--color-brand-black)" }}
              >
                {favorites.length}
              </span>
            )}
          </Button>

          {/* Burger button — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-9 w-9"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-4 pb-2">
            <SheetTitle className="font-heading text-sm font-bold tracking-tight text-left">
              <span style={{ color: "var(--color-brand-amber)" }}>▶</span>
              &nbsp;Архив звуков
            </SheetTitle>
          </SheetHeader>

          {/* Mobile search */}
          <div className="px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти звук…"
                  className="pl-8 text-sm"
                />
              </div>
            </form>
          </div>

          <Separator />

          <nav className="flex flex-col gap-1 p-3">
            <NavLink to="/" end className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              <Search className="h-4 w-4" />
              Главная
            </NavLink>
            <NavLink to="/search" className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              <Search className="h-4 w-4" />
              Все звуки
            </NavLink>
            <NavLink to="/mixer" className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              <Music2 className="h-4 w-4" />
              Микшер
            </NavLink>
            <NavLink to="/upload" className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              <Upload className="h-4 w-4" />
              Загрузить звук
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <FavoritesDrawer open={favOpen} onOpenChange={setFavOpen} />
    </>
  );
}
