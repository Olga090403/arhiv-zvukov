# Архив звуков

Веб-клиент «Архив звуков» — React + TypeScript + Vite + Supabase.

**Сайт (работает):** https://olga090403.github.io/arhiv-zvukov/

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # заполните реальными значениями
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Deploy

Продакшен-сборка — статический SPA (Vercel, Netlify или любой static host).

### Команда сборки

```bash
npm run build
```

Артефакты попадают в папку `dist/`.

### Переменные окружения

Скопируйте `.env.example` → `.env.local` локально или задайте переменные в панели хостинга (префикс `VITE_` обязателен — Vite встраивает их на этапе build).

| Переменная | Обязательна | Описание |
|---|---|---|
| `VITE_SUPABASE_URL` | да | URL проекта Supabase |
| `VITE_SUPABASE_ANON_KEY` | да | Anon/public key Supabase |
| `VITE_DO_SPACES_ENDPOINT` | нет | Endpoint DigitalOcean Spaces |
| `VITE_DO_SPACES_BUCKET` | нет | Имя bucket для аудио |
| `VITE_DO_SPACES_KEY` | нет | Access key Spaces (client-side) |
| `DO_SPACES_SECRET` | нет | Secret key Spaces (только server-side / Edge Function) |

Файл `.env.local` не коммитится (см. `.gitignore`).

### Cloudflare Pages

```bash
# 1. Токен: https://dash.cloudflare.com/profile/api-tokens (шаблон Edit Cloudflare Workers)
# 2. Account ID — в правой колонке дашборда Cloudflare
# Добавьте в .env.local: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
powershell -File scripts/setup-cloudflare-pages.ps1   # секреты в GitHub Actions
# или локально:
npx wrangler login
$env:VITE_SITE_URL="https://arhiv-zvukov.pages.dev"; $env:VITE_BASE_PATH="/"; npm run cf:deploy
```

Автодеплой: push в `master` → workflow `.github/workflows/deploy-cloudflare.yml`

### Мобильный companion (Expo)

```bash
cd apps/mobile
npm install
cp .env.example .env.local   # EXPO_PUBLIC_SUPABASE_*
npx expo start
```

Переменные мобилки: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
