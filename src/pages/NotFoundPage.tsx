import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div
        className="font-heading text-7xl font-bold"
        style={{ color: "var(--color-brand-amber)" }}
      >
        404
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold">Страница не найдена</h1>
        <p className="text-muted-foreground max-w-sm">
          Этот звук, кажется, совсем исчез.
          Попробуй вернуться на главную или воспользуйся поиском.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => navigate("/")} className="gap-2">
          <Home className="h-4 w-4" />
          На главную
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
      </div>
    </div>
  );
}
