# Архив звуков

Веб-клиент «Архив звуков» — React + TypeScript + Vite + Supabase.

**Сайт:** https://olga090403.github.io/arhiv-zvukov/

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

### Мобильный companion (Expo)

```bash
cd apps/mobile
npm install
cp .env.example .env.local   # EXPO_PUBLIC_SUPABASE_*
npx expo start
```

Переменные мобилки: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
