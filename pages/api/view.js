const supabase = require('../../../lib/supabaseAdmin')

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end()
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id 필요' })
    const { data, error } = await supabase.from('products').select('views').eq('id', id).single()
    if (error) throw error
    const newViews = (data.views || 0) + 1
    await supabase.from('products').update({ views: newViews }).eq('id', id)
    res.json({ ok: true, views: newViews })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
