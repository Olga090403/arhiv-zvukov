import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold">Загрузить звук</h1>
        <p className="text-muted-foreground text-sm">
          Поделись редкой находкой с сообществом. Все загрузки проходят
          ручную модерацию перед публикацией.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* File */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Аудиофайл</label>
          <Input type="file" accept="audio/*" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Название</label>
          <Input placeholder="Скрип снега под валенком, ул. Ленина" />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Теги</label>
          <Input placeholder="снег, зима, улица, полевая запись" />
          <p className="text-xs text-muted-foreground font-mono">
            через запятую
          </p>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Место записи</label>
          <Input placeholder="Москва, парк Горького, зима 2024" />
        </div>

        {/* License */}
        <label className="flex items-start gap-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-secondary">
          <input type="checkbox" required className="mt-0.5 accent-brand-amber" />
          <span className="text-sm">
            Подтверждаю, что звук записан мной или является CC0 / CC&nbsp;BY,
            и я передаю его сообществу «Архив звуков» на этих условиях.
          </span>
        </label>

        <Button type="submit" className="w-full">
          Отправить на модерацию
        </Button>
      </form>
    </div>
  );
}
