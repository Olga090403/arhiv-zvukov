import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sodium from "libsodium-wrappers";

const OWNER = "Olga090403";
const REPO = "arhiv-zvukov";

const cred = execSync('git credential fill', {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: "utf8",
});
const token = cred.match(/^password=(.+)$/m)?.[1];
if (!token) throw new Error("No GitHub token in git credentials");

await sodium.ready;

const { key, key_id } = await fetch(
  `https://api.github.com/repos/${OWNER}/${REPO}/actions/secrets/public-key`,
  { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } },
).then((r) => r.json());

async function setSecret(name, value) {
  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const enc = sodium.crypto_box_seal(value, binkey);
  const encrypted = sodium.to_base64(enc, sodium.base64_variants.ORIGINAL);
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/secrets/${name}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ encrypted_value: encrypted, key_id }),
  });
  if (!res.ok) throw new Error(`${name}: ${res.status} ${await res.text()}`);
  console.log(`Set secret: ${name}`);
}

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^(VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY)=(.+)$/);
  if (m) await setSecret(m[1], m[2].trim());
}

const pagesRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/pages`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ build_type: "workflow" }),
});
console.log("Pages enable:", pagesRes.status, pagesRes.status === 201 || pagesRes.status === 409 ? "OK" : await pagesRes.text());
