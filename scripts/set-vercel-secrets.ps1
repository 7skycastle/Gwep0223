<#
Usage: .\set-vercel-secrets.ps1
Requires Vercel CLI (`vercel`) to be installed and authenticated.
#>

Write-Host "This script uses Vercel CLI. Ensure 'vercel' is installed and you've run 'vercel login'."

$project = Read-Host "Vercel project name (or press Enter to skip automatic env attach)"

function Add-Secret($name) {
  $val = Read-Host "Enter value for $name (leave empty to skip)"
  if ($val) {
    Write-Host "Adding secret $name..."
    vercel secrets add $name $val -y
  } else {
    Write-Host "Skipped $name"
  }
}

Add-Secret supabase_service_role_key
Add-Secret stripe_secret_key
Add-Secret stripe_webhook_secret
Add-Secret smtp_pass

if ($project) {
  Write-Host "Attaching secrets to project env (production)..."
  vercel env add SUPABASE_SERVICE_ROLE_KEY production --from-secret supabase_service_role_key -y
  vercel env add STRIPE_SECRET_KEY production --from-secret stripe_secret_key -y
  vercel env add STRIPE_WEBHOOK_SECRET production --from-secret stripe_webhook_secret -y
  vercel env add SMTP_PASS production --from-secret smtp_pass -y
} else {
  Write-Host "No project specified. Run 'vercel link' in project folder and re-run script to attach env automatically, or attach via Vercel dashboard."
}

Write-Host "Done. Review variables in Vercel dashboard or use 'vercel env ls'."
