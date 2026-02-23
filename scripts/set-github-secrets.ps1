<#
Usage: .\set-github-secrets.ps1 -Repo "owner/repo" 
Requires GitHub CLI (`gh`) to be installed and authenticated.
#>
param(
  [string]$Repo = "7skycastle/Gwep0223"
)

Write-Host "Using repository: $Repo"

function Prompt-Secret($name) {
  $val = Read-Host "Enter value for $name (leave empty to skip)"
  if ($val) {
    Write-Host "Setting GitHub secret $name..."
    gh secret set $name --body $val --repo $Repo
  } else {
    Write-Host "Skipped $name"
  }
}

Prompt-Secret NEXT_PUBLIC_SUPABASE_URL
Prompt-Secret NEXT_PUBLIC_SUPABASE_ANON_KEY
Prompt-Secret SUPABASE_SERVICE_ROLE_KEY
Prompt-Secret STRIPE_SECRET_KEY
Prompt-Secret STRIPE_WEBHOOK_SECRET
Prompt-Secret SMTP_HOST
Prompt-Secret SMTP_PORT
Prompt-Secret SMTP_USER
Prompt-Secret SMTP_PASS
Prompt-Secret EMAIL_FROM
Prompt-Secret NEXT_PUBLIC_SITE_URL

Write-Host "Done. Verify secrets in GitHub repository settings: https://github.com/$Repo/settings/secrets/actions"
