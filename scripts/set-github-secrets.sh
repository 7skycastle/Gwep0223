#!/usr/bin/env bash
set -e
# Usage: ./set-github-secrets.sh [owner/repo]
REPO=${1:-7skycastle/Gwep0223}

echo "Using repository: $REPO"

prompt_secret(){
  local name=$1
  local var
  read -p "Enter value for $name (or leave empty to skip): " var
  if [ -n "$var" ]; then
    echo "Setting GitHub secret $name..."
    gh secret set "$name" --body "$var" --repo "$REPO"
  else
    echo "Skipped $name"
  fi
}

echo "Make sure GitHub CLI (gh) is installed and you're logged in (gh auth login)."

prompt_secret NEXT_PUBLIC_SUPABASE_URL
prompt_secret NEXT_PUBLIC_SUPABASE_ANON_KEY
prompt_secret SUPABASE_SERVICE_ROLE_KEY
prompt_secret STRIPE_SECRET_KEY
prompt_secret STRIPE_WEBHOOK_SECRET
prompt_secret SMTP_HOST
prompt_secret SMTP_PORT
prompt_secret SMTP_USER
prompt_secret SMTP_PASS
prompt_secret EMAIL_FROM
prompt_secret NEXT_PUBLIC_SITE_URL

echo "All done. Verify secrets in GitHub repository settings."
