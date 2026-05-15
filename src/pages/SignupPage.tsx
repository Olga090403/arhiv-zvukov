import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password || !confirm) {
      toast.error("Заполни все поля");
      return;
    }
    if (password.length < 6) {
      toast.error("Пароль — минимум 6 символов");
      return;
    }
    if (password !== confirm) {
      toast.error("Пароли не совпадают");
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

    toast.success("Регистрация успешна! Проверь почту для подтверждения.");
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-sm space-y-8 pt-8">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold">Регистрация</h1>
        <p className="text-sm text-muted-foreground">
          Создай аккаунт для облачной синхронизации
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Подтверди пароль</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Ещё раз"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          <UserPlus className="h-4 w-4" />
          {loading ? "Создаю…" : "Создать аккаунт"}
        </Button>
      </form>

      <Separator />

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Войти
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Регистрация необязательна — весь архив доступен без аккаунта.
      </p>
    </div>
  );
}
