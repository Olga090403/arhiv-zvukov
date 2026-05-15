import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layout/AuthLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Заполни все поля");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Login error:", error);
      toast.error(
        error.message === "Invalid login credentials"
          ? "Неверный email или пароль"
          : error.message
      );
      return;
    }

    toast.success("Добро пожаловать!");
    navigate("/");
  }

  return (
    <AuthLayout
      heading="С возвращением"
      subheading="Войди, чтобы синхронизировать избранное, миксы и загрузки между устройствами."
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
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
          {loading ? "Вхожу…" : "Войти"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link to="/signup" className="font-medium text-foreground hover:underline">
          Зарегистрируйся
        </Link>
      </p>

      <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
        Вход необязателен — весь архив доступен без регистрации.
      </p>
    </AuthLayout>
  );
}
