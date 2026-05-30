# Sets GitHub Actions secrets for Cloudflare Pages deploy.
# Before running:
#   1. Create API token: https://dash.cloudflare.com/profile/api-tokens
#      Template: "Edit Cloudflare Workers" (includes Pages)
#   2. Copy Account ID from Cloudflare dashboard (right sidebar on any zone/account page)
#   3. Add to .env.local:
#      CLOUDFLARE_API_TOKEN=...
#      CLOUDFLARE_ACCOUNT_ID=...

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not (Test-Path ".env.local")) {
  Write-Error "Missing .env.local with CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID"
}

$cfToken = $null
$cfAccount = $null
Get-Content ".env.local" | ForEach-Object {
  if ($_ -match '^\s*CLOUDFLARE_API_TOKEN=(.+)$') { $cfToken = $matches[1].Trim() }
  if ($_ -match '^\s*CLOUDFLARE_ACCOUNT_ID=(.+)$') { $cfAccount = $matches[1].Trim() }
}

if (-not $cfToken -or -not $cfAccount) {
  Write-Error "Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID to .env.local"
}

$input = @"
protocol=https
host=github.com

"@
$token = ($input | git credential fill | Select-String "^password=").ToString().Split("=", 2)[1]
$env:GH_TOKEN = $token

Write-Host "Setting GitHub secrets for Cloudflare Pages..."
npx gh secret set CLOUDFLARE_API_TOKEN --body $cfToken --repo Olga090403/arhiv-zvukov
npx gh secret set CLOUDFLARE_ACCOUNT_ID --body $cfAccount --repo Olga090403/arhiv-zvukov

Get-Content ".env.local" | ForEach-Object {
  if ($_ -match '^(VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY)=(.+)$') {
    $name = $matches[1]
    $val = $matches[2].Trim()
    Write-Host "Setting secret $name..."
    npx gh secret set $name --body $val --repo Olga090403/arhiv-zvukov
  }
}

Write-Host "Done. Push to master or run 'Deploy to Cloudflare Pages' workflow manually."
