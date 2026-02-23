const supabase = require('../../../lib/supabaseAdmin')

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).end()
    const { product_id } = req.query
    if (!product_id) return res.status(400).json({ error: 'product_id 필요' })

    // 소유자 인증: Authorization: Bearer <token>
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) return res.status(401).json({ error: '인증 필요' })
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !user) return res.status(401).json({ error: '유효한 토큰이 아닙니다' })

    // 상품 소유자 확인
    const { data: product, error: pErr } = await supabase.from('products').select('owner_id').eq('id', product_id).single()
    if (pErr) throw pErr
    if (!product || product.owner_id !== user.id) return res.status(403).json({ error: '권한 없음' })

    const { data, error } = await supabase.from('messages').select('*').eq('product_id', product_id).order('created_at', { ascending: false })
    if (error) throw error
    res.json({ ok: true, items: data })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
