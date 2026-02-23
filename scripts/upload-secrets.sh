#!/usr/bin/env bash
# Non-interactive secrets uploader (bash)
# Usage:
# 1. Create .env.secrets with KEY=VALUE lines in repo root
# 2. Run: ./scripts/upload-secrets.sh owner/repo [--attach-vercel]
# Requirements: gh and vercel CLI logged in (vercel link if attaching)

set -euo pipefail
REPO=${1:-7skycastle/Gwep0223}
ATTACH_VERCEL=false
if [ "${2:-}" = "--attach-vercel" ]; then ATTACH_VERCEL=true; fi

if [ ! -f ./.env.secrets ]; then
  echo ".env.secrets not found in repo root. Create it and retry." >&2
  exit 1
fi

while IFS= read -r line; do
  # skip comments/empty
  [[ "$line" =~ ^\s*$ ]] && continue
  [[ "$line" =~ ^\s*# ]] && continue
  if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
    name="${BASH_REMATCH[1]}"
    value="${BASH_REMATCH[2]}"
    if [ -n "$value" ]; then
      echo "Setting GitHub secret $name"
      echo -n "$value" | gh secret set "$name" --repo "$REPO"
    else
      echo "Skipping $name (empty)"
    fi
  fi
done < ./.env.secrets

if [ "$ATTACH_VERCEL" = true ]; then
  echo "Adding selected Vercel secrets and envs (requires vercel link)"
  add_secret(){
    key=$1
    val=$(grep "^$key=" .env.secrets | sed -E "s/^$key=(.*)$/\1/")
    if [ -n "$val" ]; then
      vercel secrets add "$key" "$val" || echo "vercel secret add $key failed or exists"
      vercel env add "$key" production --from-secret "$key" -y || echo "attach $key failed"
    fi
  }
  add_secret SUPABASE_SERVICE_ROLE_KEY
  add_secret STRIPE_SECRET_KEY
  add_secret STRIPE_WEBHOOK_SECRET
  add_secret SMTP_PASS

  # public keys
  add_public(){
    key=$1
    val=$(grep "^$key=" .env.secrets | sed -E "s/^$key=(.*)$/\1/")
    if [ -n "$val" ]; then
      vercel env add "$key" production "$val" -y || echo "vercel env add $key failed"
    fi
  }
  add_public NEXT_PUBLIC_SUPABASE_URL
  add_public NEXT_PUBLIC_SUPABASE_ANON_KEY
  add_public NEXT_PUBLIC_SITE_URL
fi

echo "Done. Verify secrets in GitHub and Vercel dashboard."
