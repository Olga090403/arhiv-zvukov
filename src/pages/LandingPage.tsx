import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const EXAMPLE_SOUNDS = [
  { id: "1", label: "Скрип снега под валенком" },
  { id: "2", label: "Гудок метро 80-х" },
  { id: "3", label: "Жужжание старой лампы" },
];

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="flex flex-col items-center gap-10 pt-8 text-center md:pt-16">
      {/* Hero */}
      <div className="max-w-2xl space-y-4">
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Найди звук, который{" "}
          <span className="text-brand-amber">исчезает</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Кураторская библиотека забытых бытовых и атмосферных звуков.
          Исказь пресетом, смиксуй и скачай за&nbsp;2&nbsp;минуты — бесплатно,
          без регистрации.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Скрип снега, метро 80-х, старая лампа…"
          className="flex-1"
        />
        <Button type="submit">Найти</Button>
      </form>

      {/* Examples */}
      <div className="flex flex-wrap justify-center gap-3">
        <span className="text-sm text-muted-foreground">Попробуй без регистрации:</span>
        {EXAMPLE_SOUNDS.map((s) => (
          <Button
            key={s.id}
            variant="outline"
            size="sm"
            onClick={() => navigate(`/sound/${s.id}`)}
          >
            {s.label}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/sound/random`)}
        >
          🎲 Случайный звук
        </Button>
      </div>

      {/* Tagline */}
      <p className="font-mono text-xs text-muted-foreground">
        Не просто библиотека. Диджей-пульт для звуков, которые исчезают.
      </p>
    </section>
  );
}
