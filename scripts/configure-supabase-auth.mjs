/**
 * Configure Supabase Auth URLs for Netlify deploy.
 *
 * Usage:
 *   1. Create token: https://supabase.com/dashboard/account/tokens
 *   2. Run:
 *      $env:SUPABASE_ACCESS_TOKEN="sbp_..."
 *      node scripts/configure-supabase-auth.mjs
 */

const PROJECT_REF = "uggsrgwyymivzntnopze";
const SITE_URL = process.env.SITE_URL ?? "https://olga090403.github.io/arhiv-zvukov";

const REDIRECT_URLS = [
  `${SITE_URL}/**`,
  "https://olga090403.github.io/arhiv-zvukov/**",
  "https://arhiv-zvukov.netlify.app/**",
  "http://localhost:5173/**",
  "http://localhost:8081/**",
  "exp://**",
];

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)");
  process.exit(1);
}

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    site_url: SITE_URL,
    uri_allow_list: REDIRECT_URLS.join(","),
  }),
});

if (!res.ok) {
  console.error("Failed:", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
console.log("Supabase Auth updated:");
console.log("  site_url:", data.site_url ?? SITE_URL);
console.log("  uri_allow_list:", data.uri_allow_list ?? REDIRECT_URLS.join(","));
