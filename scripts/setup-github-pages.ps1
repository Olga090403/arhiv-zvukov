$input = @"
protocol=https
host=github.com

"@
$token = ($input | git credential fill | Select-String "^password=").ToString().Split("=", 2)[1]
$env:GH_TOKEN = $token

Get-Content ".env.local" | ForEach-Object {
  if ($_ -match '^(VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY)=(.+)$') {
    $name = $matches[1]
    $val = $matches[2].Trim()
    Write-Host "Setting secret $name..."
    npx gh secret set $name --body $val --repo Olga090403/arhiv-zvukov
  }
}

Write-Host "Enabling GitHub Pages..."
npx gh api repos/Olga090403/arhiv-zvukov/pages -X POST -f build_type=workflow
