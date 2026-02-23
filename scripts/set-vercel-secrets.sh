#!/usr/bin/env bash
set -e
# Usage: ./set-vercel-secrets.sh

echo "This script uses Vercel CLI. Ensure 'vercel' is installed and you're logged in (vercel login)."

read -p "Vercel project name (slug) or leave empty to run interactive vercel link: " VERCEL_PROJECT

add_secret(){
  local secret_name=$1
  read -p "Enter value for $secret_name (or leave empty to skip): " val
  if [ -n "$val" ]; then
    echo "Adding secret $secret_name..."
    vercel secrets add "$secret_name" "$val" || echo "secret exists or failed"
  else
    echo "Skipped $secret_name"
  fi
}

add_secret supabase_service_role_key
add_secret stripe_secret_key
add_secret stripe_webhook_secret
add_secret smtp_pass

echo "Now attach secrets to environment variables (production)."
attach_env(){
  local env_name=$1
  local secret_name=$2
  if [ -z "$secret_name" ]; then
    echo "Skipping $env_name"
    return
  fi
  if [ -n "$VERCEL_PROJECT" ]; then
    vercel env add "$env_name" production --from-secret "$secret_name" --yes || echo "Failed to attach $env_name"
  else
    echo "Run 'vercel link' in this folder and re-run script to attach env automatically. Or attach via Vercel dashboard."
    break
  fi
}

if [ -n "$VERCEL_PROJECT" ]; then
  attach_env SUPABASE_SERVICE_ROLE_KEY supabase_service_role_key
  attach_env STRIPE_SECRET_KEY stripe_secret_key
  attach_env STRIPE_WEBHOOK_SECRET stripe_webhook_secret
  attach_env SMTP_PASS smtp_pass
fi

echo "Done. Alternatively, open Vercel dashboard to review environment variables." 
