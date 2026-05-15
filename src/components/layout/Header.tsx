import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Heart, Upload, Music2, Search, Menu, Home, Library } from "lucide-react";
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

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm font-medium transition-colors",
      isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    ].join(" ");

  const mobileLink = ({ isActive }: { isActive: boolean }) =>
    [
      "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-foreground text-background"
        : "text-foreground hover:bg-secondary",
    ].join(" ");

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 md:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 font-heading text-sm font-bold tracking-tight hover:opacity-70 transition-opacity"
          >
            <span style={{ color: "var(--color-brand-amber)" }}>▶</span>
            {" "}Архив звуков
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-5">
            <NavLink to="/search" className={desktopLink}>Каталог</NavLink>
            <NavLink to="/mixer" className={desktopLink}>Микшер</NavLink>
            <NavLink to="/upload" className={desktopLink}>Загрузить</NavLink>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск…"
                className="h-8 w-44 pl-8 text-sm bg-transparent border-transparent hover:border-border focus:border-border transition-colors"
              />
            </div>
          </form>

          {/* Favorites */}
          <button
            onClick={() => setFavOpen(true)}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart className="h-4 w-4" />
            {favorites.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: "var(--color-brand-amber)", color: "var(--color-brand-black)" }}
              >
                {favorites.length}
              </span>
            )}
          </button>

          {/* Burger */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden h-8 w-8"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-5 pb-3">
            <SheetTitle className="font-heading text-sm font-bold tracking-tight text-left">
              <span style={{ color: "var(--color-brand-amber)" }}>▶</span>
              {" "}Архив звуков
            </SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти звук…"
                  className="pl-9"
                />
              </div>
            </form>
          </div>

          <Separator />

          <nav className="flex flex-col gap-1 p-3">
            <NavLink to="/" end className={mobileLink} onClick={() => setMenuOpen(false)}>
              <Home className="h-4 w-4" />
              Главная
            </NavLink>
            <NavLink to="/search" className={mobileLink} onClick={() => setMenuOpen(false)}>
              <Library className="h-4 w-4" />
              Каталог
            </NavLink>
            <NavLink to="/mixer" className={mobileLink} onClick={() => setMenuOpen(false)}>
              <Music2 className="h-4 w-4" />
              Микшер
            </NavLink>
            <NavLink to="/upload" className={mobileLink} onClick={() => setMenuOpen(false)}>
              <Upload className="h-4 w-4" />
              Загрузить
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <FavoritesDrawer open={favOpen} onOpenChange={setFavOpen} />
    </>
  );
}
