import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Header from "./Header";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <Outlet />
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
