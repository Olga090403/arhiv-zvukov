import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogIn } from "lucide-react";
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
    <div className="mx-auto max-w-sm space-y-8 pt-8">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold">Вход</h1>
        <p className="text-sm text-muted-foreground">
          Войди, чтобы синхронизировать избранное и миксы
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          <LogIn className="h-4 w-4" />
          {loading ? "Вхожу…" : "Войти"}
        </Button>
      </form>

      <Separator />

      <p className="text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link to="/signup" className="font-medium text-foreground hover:underline">
          Зарегистрируйся
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        Вход необязателен — весь архив доступен без регистрации.
      </p>
    </div>
  );
}
