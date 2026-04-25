import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Upload, CheckCircle2, FileAudio } from "lucide-react";
import { toast } from "sonner";

export default function UploadPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    tags: "",
    location: "",
    description: "",
    licenseAgreed: false,
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFileName(f?.name ?? null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.licenseAgreed) {
      toast.error("Подтверди лицензию CC0 / CC BY");
      return;
    }
    if (!fileName) {
      toast.error("Выбери аудиофайл");
      return;
    }
    // MVP: mock submission — real INSERT in Layer 2
    setSubmitted(true);
    toast.success("Спасибо! Звук отправлен на модерацию.");
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md flex flex-col items-center gap-6 py-20 text-center">
        <CheckCircle2
          className="h-16 w-16"
          style={{ color: "var(--color-brand-amber)" }}
        />
        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold">
            Звук отправлен!
          </h2>
          <p className="text-muted-foreground">
            Мы проверим его и опубликуем в течение 24–48 часов.
            Спасибо, что помогаешь пополнять архив.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/")}>На главную</Button>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Загрузить ещё
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-bold">Загрузить звук</h1>
        <p className="text-muted-foreground text-sm">
          Поделись редкой находкой. Все загрузки проходят ручную модерацию
          перед публикацией.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File */}
        <div className="space-y-2">
          <Label>Аудиофайл *</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-primary hover:bg-secondary">
            <FileAudio
              className="h-8 w-8 text-muted-foreground"
              style={fileName ? { color: "var(--color-brand-amber)" } : {}}
            />
            <div className="text-center">
              {fileName ? (
                <p className="text-sm font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm font-medium">Перетащи файл или кликни</p>
                  <p className="text-xs text-muted-foreground">MP3, WAV, FLAC, OGG — до 50 МБ</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={handleFile}
              required
            />
          </label>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Название *</Label>
          <Input
            id="title"
            placeholder="Скрип снега под валенком, ул. Ленина"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="desc">Описание</Label>
          <Textarea
            id="desc"
            placeholder="Контекст записи: где, когда, при каких условиях…"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Теги *</Label>
          <Input
            id="tags"
            placeholder="снег, зима, улица, полевая запись"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            required
          />
          <p className="text-xs text-muted-foreground font-mono">через запятую</p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Место записи</Label>
          <Input
            id="location"
            placeholder="Москва, парк Горького, зима 2024"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
        </div>

        <Separator />

        {/* License */}
        <Card>
          <CardContent className="p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-[#F2C94C]"
                checked={form.licenseAgreed}
                onChange={(e) => setForm((f) => ({ ...f, licenseAgreed: e.target.checked }))}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">Подтверждение лицензии *</p>
                <p className="text-xs text-muted-foreground">
                  Подтверждаю, что звук записан мной или является CC0 / CC&nbsp;BY,
                  и я передаю его сообществу «Архив звуков» на этих условиях.
                  Нарушение авторских прав ведёт к удалению записи.
                </p>
              </div>
            </label>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full gap-2">
          <Upload className="h-5 w-5" />
          Отправить на модерацию
        </Button>
      </form>
    </div>
  );
}
