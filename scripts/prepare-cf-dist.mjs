import { copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const redirects = resolve(root, "public/_redirects.cloudflare");
const target = resolve(root, "dist/_redirects");

if (!existsSync(redirects)) {
  console.error("Missing public/_redirects.cloudflare");
  process.exit(1);
}

copyFileSync(redirects, target);
console.log("Copied SPA redirects for Cloudflare Pages");
