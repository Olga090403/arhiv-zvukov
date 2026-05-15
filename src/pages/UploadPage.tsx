import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Upload, CheckCircle2, FileAudio } from "lucide-react";
import { supabase } from "@/lib/supabase";
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

  const [submitting, setSubmitting] = useState(false);

  function getSessionId(): string {
    let sid = localStorage.getItem("session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("session_id", sid);
    }
    return sid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.licenseAgreed) {
      toast.error("Подтверди лицензию CC0 / CC BY");
      return;
    }
    if (!fileName) {
      toast.error("Выбери аудиофайл");
      return;
    }

    setSubmitting(true);

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("uploads").insert({
      session_id: getSessionId(),
      title: form.title,
      file_url: `pending://${fileName}`,
      tags: tags.length > 0 ? tags : null,
      location: form.location || null,
      license_agreed: true,
    });

    setSubmitting(false);

    if (error) {
      console.error("Supabase insert error:", error);
      toast.error("Ошибка отправки. Попробуй ещё раз.");
      return;
    }

    setSubmitted(true);
    toast.success("Звук отправлен на модерацию");
  }

  if (submitted) {
    return (
      <div className="relative mx-auto max-w-md flex flex-col items-center gap-8 py-20 text-center">
        <div className="gradient-blob top-[-150px] right-[-100px] opacity-20" />
        <CheckCircle2
          className="relative z-10 h-16 w-16"
          style={{ color: "var(--color-brand-amber)" }}
        />
        <div className="relative z-10 space-y-2">
          <h2 className="font-heading text-3xl font-bold">Отправлено!</h2>
          <p className="text-muted-foreground">
            Мы проверим звук и опубликуем в течение 24–48 часов.
            Спасибо, что пополняешь архив.
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <Button onClick={() => navigate("/")}>На главную</Button>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Загрузить ещё
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="font-mono text-xs tracking-[0.15em] uppercase text-muted-foreground">
          Загрузка
        </span>
        <h1 className="font-heading text-3xl font-bold md:text-4xl">Загрузить звук</h1>
        <p className="text-muted-foreground text-sm">
          Поделись редкой находкой. Все загрузки проходят ручную модерацию.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File drop */}
        <div className="space-y-2">
          <Label>Аудиофайл *</Label>
          <label className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-border p-10 transition-all hover:border-primary hover:bg-secondary/50">
            <FileAudio
              className="h-10 w-10"
              style={fileName ? { color: "var(--color-brand-amber)" } : { color: "var(--muted-foreground)" }}
            />
            {fileName ? (
              <p className="text-sm font-medium">{fileName}</p>
            ) : (
              <div className="text-center">
                <p className="text-sm font-medium">Перетащи файл или кликни</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  MP3, WAV, FLAC, OGG — до 50 МБ
                </p>
              </div>
            )}
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
            placeholder="Где, когда, при каких условиях записано…"
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
        <label className="flex items-start gap-3 rounded-xl border border-border p-5 cursor-pointer hover:bg-secondary/50 transition-colors">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#F2C94C]"
            checked={form.licenseAgreed}
            onChange={(e) => setForm((f) => ({ ...f, licenseAgreed: e.target.checked }))}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">Подтверждение лицензии *</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Подтверждаю, что звук записан мной или является CC0 / CC&nbsp;BY,
              и я передаю его сообществу на этих условиях.
            </p>
          </div>
        </label>

        <Button type="submit" size="lg" className="w-full gap-2 h-12" disabled={submitting}>
          <Upload className="h-5 w-5" />
          {submitting ? "Отправляю…" : "Отправить на модерацию"}
        </Button>
      </form>
    </div>
  );
}
