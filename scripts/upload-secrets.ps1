<#
Non-interactive secrets uploader (PowerShell)
Usage:
  1. Create a file `.env.secrets` in repository root with KEY=VALUE lines.
  2. Run: `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process; .\scripts\upload-secrets.ps1 -Repo "owner/repo"`
Requirements: `gh` and `vercel` CLIs logged in. `vercel link` recommended to attach env automatically.
#>
param(
  [string]$Repo = "7skycastle/Gwep0223",
  [switch]$AttachVercelEnv
)

if (-not (Test-Path .\env.secrets)) {
  Write-Error ".\env.secrets not found. Create file with KEY=VALUE lines and rerun."
  exit 1
}

Write-Host "Reading .\env.secrets and setting GitHub Secrets for $Repo"

Get-Content .\env.secrets | ForEach-Object {
  if ($_ -match '^[\s#]*$') { return }
  if ($_ -match '^\s*([^=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    if ($value -ne "") {
      Write-Host "Setting GitHub secret: $name"
      gh secret set $name --body "$value" --repo $Repo
    } else {
      Write-Host "Skipping $name (empty)"
    }
  }
}

if ($AttachVercelEnv) {
  Write-Host "Also adding Vercel secrets & env (requires vercel login and project link)"
  # Add some common sensitive keys as Vercel secrets
  $sensitive = @('SUPABASE_SERVICE_ROLE_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','SMTP_PASS')
  foreach ($k in $sensitive) {
    $line = Get-Content .\env.secrets | Where-Object { $_ -match "^$k=" }
    if ($line) {
      $val = ($line -split '=',2)[1]
      if ($val) {
        Write-Host "Adding vercel secret $k"
        vercel secrets add $k $val -y || Write-Host "vercel secret add failed (maybe exists)"
        # attach to production env var
        vercel env add $k production --from-secret $k -y || Write-Host "vercel env add $k failed"
      }
    }
  }
  # Public keys (client) attach directly
  $publicKeys = @('NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_SITE_URL')
  foreach ($k in $publicKeys) {
    $line = Get-Content .\env.secrets | Where-Object { $_ -match "^$k=" }
    if ($line) {
      $val = ($line -split '=',2)[1]
      if ($val) {
        vercel env add $k production $val -y || Write-Host "vercel env add $k failed"
      }
    }
  }
}

Write-Host "Done. Verify secrets in GitHub repository settings and in Vercel dashboard."
