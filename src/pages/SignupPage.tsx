import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layout/AuthLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { t } from "@/lib/typography";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password || !confirm) {
      toast.error(t("Заполни все поля"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("Пароль — минимум 6 символов"));
      return;
    }
    if (password !== confirm) {
      toast.error(t("Пароли не совпадают"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Signup error:", error);
      toast.error(error.message);
      return;
    }

    toast.success(t("Регистрация успешна! Проверь почту для подтверждения."));
    navigate("/login");
  }

  return (
    <AuthLayout
      heading="Создать аккаунт"
      subheading="Получи доступ к облачной синхронизации избранного и миксов — слушай на любом устройстве."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Пароль
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm" className="text-xs font-medium text-muted-foreground">
            Подтверди пароль
          </Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Ещё раз"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
            className="h-11"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-sm font-semibold tracking-wide"
          disabled={loading}
        >
          {loading ? "Создаю…" : "Создать аккаунт"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Войти
        </Link>
      </p>

      <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
        {t("Регистрация необязательна — весь архив доступен без аккаунта.")}
      </p>
    </AuthLayout>
  );
}
