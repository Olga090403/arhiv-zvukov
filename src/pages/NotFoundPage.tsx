import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { t } from "@/lib/typography";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 py-24 text-center">
      <div className="gradient-blob top-[-100px] left-[30%] opacity-20" />

      <div className="relative z-10 space-y-6">
        <p
          className="font-heading text-[120px] font-bold leading-none md:text-[180px]"
          style={{ color: "var(--color-brand-amber)" }}
        >
          404
        </p>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold">Страница не найдена</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {t("Этот звук, кажется, совсем исчез. Попробуй вернуться на главную или воспользуйся поиском.")}
          </p>
        </div>
        <div className="flex justify-center gap-3">
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
    </div>
  );
}
