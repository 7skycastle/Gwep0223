const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.warn('Supabase admin env vars not set')
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE)

module.exports = supabaseAdmin
