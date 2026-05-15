import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, CheckCircle2, FileAudio, Pencil, Trash2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { DbUpload } from "@/lib/database.types";
import { toast } from "sonner";

function getSessionId(): string {
  let sid = localStorage.getItem("session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("session_id", sid);
  }
  return sid;
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "На модерации", variant: "secondary" },
  approved: { label: "Опубликован", variant: "default" },
  rejected: { label: "Отклонён", variant: "destructive" },
};

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: "",
    tags: "",
    location: "",
    description: "",
    licenseAgreed: false,
  });

  // My uploads
  const [uploads, setUploads] = useState<DbUpload[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);

  // Edit dialog
  const [editUpload, setEditUpload] = useState<DbUpload | null>(null);
  const [editForm, setEditForm] = useState({ title: "", tags: "", location: "" });
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteUpload, setDeleteUpload] = useState<DbUpload | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyUploads = useCallback(async () => {
    setLoadingUploads(true);

    let query = supabase
      .from("uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (user) {
      query = query.or(`user_id.eq.${user.id},session_id.eq.${getSessionId()}`);
    } else {
      query = query.eq("session_id", getSessionId());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Fetch uploads error:", error);
    } else {
      setUploads(data ?? []);
    }
    setLoadingUploads(false);
  }, [user]);

  useEffect(() => {
    fetchMyUploads();
  }, [fetchMyUploads]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setFileName(f?.name ?? null);
    if (f) setErrors((prev) => ({ ...prev, file: "" }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!fileName) errs.file = "Выбери аудиофайл";
    if (!form.title.trim()) errs.title = "Введи название";
    if (!form.tags.trim()) errs.tags = "Добавь хотя бы один тег";
    if (!form.licenseAgreed) errs.license = "Подтверди лицензию";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("uploads").insert({
      session_id: getSessionId(),
      user_id: user?.id ?? null,
      title: form.title.trim(),
      file_url: `pending://${fileName}`,
      tags: tags.length > 0 ? tags : null,
      location: form.location.trim() || null,
      license_agreed: true,
    });

    setSubmitting(false);

    if (error) {
      console.error("Insert error:", error);
      toast.error("Ошибка отправки. Попробуй ещё раз.");
      return;
    }

    setSubmitted(true);
    toast.success("Звук отправлен на модерацию");
    fetchMyUploads();
  }

  // ── EDIT ──
  function openEdit(upload: DbUpload) {
    setEditForm({
      title: upload.title,
      tags: (upload.tags ?? []).join(", "),
      location: upload.location ?? "",
    });
    setEditUpload(upload);
  }

  async function handleSaveEdit() {
    if (!editUpload) return;
    if (!editForm.title.trim()) {
      toast.error("Название не может быть пустым");
      return;
    }

    setSaving(true);

    const tags = editForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const q = supabase
      .from("uploads")
      .update({
        title: editForm.title.trim(),
        tags: tags.length > 0 ? tags : null,
        location: editForm.location.trim() || null,
      })
      .eq("id", editUpload.id);

    const { error } = await (user
      ? q.eq("user_id", user.id)
      : q.eq("session_id", getSessionId()));

    setSaving(false);

    if (error) {
      console.error("Update error:", error);
      toast.error("Ошибка сохранения");
      return;
    }

    toast.success("Сохранено");
    setEditUpload(null);
    fetchMyUploads();
  }

  // ── DELETE ──
  async function handleDelete() {
    if (!deleteUpload) return;
    setDeleting(true);

    const q = supabase
      .from("uploads")
      .delete()
      .eq("id", deleteUpload.id);

    const { error } = await (user
      ? q.eq("user_id", user.id)
      : q.eq("session_id", getSessionId()));

    setDeleting(false);

    if (error) {
      console.error("Delete error:", error);
      toast.error("Ошибка удаления");
      return;
    }

    toast.success("Загрузка удалена");
    setDeleteUpload(null);
    setUploads((prev) => prev.filter((u) => u.id !== deleteUpload.id));
  }

  // ── Success screen ──
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
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <Button onClick={() => navigate("/")}>На главную</Button>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setForm({ title: "", tags: "", location: "", description: "", licenseAgreed: false });
              setFileName(null);
              setErrors({});
            }}
          >
            Загрузить ещё
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-10">
      {/* ── Upload form ── */}
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
        {/* File */}
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
            <input type="file" accept="audio/*" className="sr-only" onChange={handleFile} />
          </label>
          {errors.file && <p className="text-xs text-destructive">{errors.file}</p>}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Название *</Label>
          <Input
            id="title"
            placeholder="Скрип снега под валенком, ул. Ленина"
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }));
              if (errors.title) setErrors((p) => ({ ...p, title: "" }));
            }}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
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
            onChange={(e) => {
              setForm((f) => ({ ...f, tags: e.target.value }));
              if (errors.tags) setErrors((p) => ({ ...p, tags: "" }));
            }}
          />
          <p className="text-xs text-muted-foreground font-mono">через запятую</p>
          {errors.tags && <p className="text-xs text-destructive">{errors.tags}</p>}
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
            onChange={(e) => {
              setForm((f) => ({ ...f, licenseAgreed: e.target.checked }));
              if (errors.license) setErrors((p) => ({ ...p, license: "" }));
            }}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">Подтверждение лицензии *</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Подтверждаю, что звук записан мной или является CC0 / CC&nbsp;BY,
              и я передаю его сообществу на этих условиях.
            </p>
          </div>
        </label>
        {errors.license && <p className="text-xs text-destructive">{errors.license}</p>}

        <Button type="submit" size="lg" className="w-full gap-2 h-12" disabled={submitting}>
          <Upload className="h-5 w-5" />
          {submitting ? "Отправляю…" : "Отправить на модерацию"}
        </Button>
      </form>

      {/* ── My uploads ── */}
      <Separator />

      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold">Мои загрузки</h2>
          <p className="text-sm text-muted-foreground">
            {user
              ? "Загрузки привязаны к твоему аккаунту."
              : "Загрузки привязаны к этому браузеру. Войди, чтобы управлять ими."}
          </p>
        </div>

        {loadingUploads && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border p-4 animate-pulse space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        )}

        {!loadingUploads && uploads.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              У тебя пока нет загрузок
            </p>
          </div>
        )}

        {!loadingUploads && uploads.length > 0 && (
          <div className="space-y-3">
            {uploads.map((u) => {
              const st = STATUS_MAP[u.status] ?? STATUS_MAP.pending;
              return (
                <div
                  key={u.id}
                  className="flex items-start gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium text-sm truncate">{u.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={st.variant} className="text-[10px] py-0 font-mono">
                        {st.label}
                      </Badge>
                      {u.tags && u.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="font-mono text-[10px]">#{tag}</span>
                      ))}
                      {u.location && <span>· {u.location}</span>}
                    </div>
                    {u.moderator_note && (
                      <p className="text-xs text-destructive mt-1">
                        Модератор: {u.moderator_note}
                      </p>
                    )}
                  </div>

                  {/* Edit + Delete: pending + owner (RLS requires auth.uid() = user_id) */}
                  {u.status === "pending" && user && u.user_id === user.id && (
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteUpload(u)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Edit Dialog ── */}
      <Dialog open={!!editUpload} onOpenChange={(open) => !open && setEditUpload(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Редактировать загрузку</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Теги</Label>
              <Input
                value={editForm.tags}
                onChange={(e) => setEditForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="через запятую"
              />
            </div>
            <div className="space-y-2">
              <Label>Место записи</Label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUpload(null)}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Сохраняю…" : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete AlertDialog ── */}
      <AlertDialog open={!!deleteUpload} onOpenChange={(open) => !open && setDeleteUpload(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Удалить загрузку?</AlertDialogTitle>
            <AlertDialogDescription>
              «{deleteUpload?.title}» будет удалена безвозвратно.
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Удаляю…" : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
