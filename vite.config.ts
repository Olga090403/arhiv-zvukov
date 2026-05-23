import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL ?? "https://olga090403.github.io/arhiv-zvukov").replace(/\/$/, "");
  const base = env.VITE_BASE_PATH ?? "/";

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "inject-site-url",
        transformIndexHtml(html) {
          return html.replaceAll("__SITE_URL__", siteUrl);
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
