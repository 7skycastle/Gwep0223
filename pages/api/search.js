const supabase = require('../../../lib/supabaseAdmin')

export default async function handler(req, res) {
  try {
    const { q, category, limit = 50 } = req.query
    let query = supabase.from('products').select('*')
    if (q) query = query.ilike('title', `%${q}%`)
    if (category) query = query.eq('category', category)
    const { data, error } = await query.order('created_at', { ascending: false }).limit(parseInt(limit))
    if (error) throw error
    res.json({ ok: true, items: data })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
