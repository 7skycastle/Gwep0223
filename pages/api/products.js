import supabase from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  try {
    const { period } = req.query // period = day|week|month
    let since = new Date()
    if (period === 'week') since.setDate(since.getDate() - 7)
    else if (period === 'month') since.setMonth(since.getMonth() - 1)
    else since.setDate(since.getDate() - 1)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('created_at', since.toISOString())
      .order('views', { ascending: false })
      .limit(50)

    if (error) throw error
    res.json({ ok: true, items: data })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
