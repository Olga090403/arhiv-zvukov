import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "./Header";

export default function RootLayout() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main className={isLanding ? "" : "mx-auto max-w-7xl px-4 py-8 md:px-8"}>
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
