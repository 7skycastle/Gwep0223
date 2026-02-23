const supabase = require('../../../../lib/supabaseAdmin')

export default async function handler(req, res) {
  try {
    if (req.method !== 'PATCH') return res.status(405).end()
    const { id, status } = req.body
    if (!id || !status) return res.status(400).json({ error: 'id와 status 필요' })

    // 인증 및 소유자 확인
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) return res.status(401).json({ error: '인증 필요' })
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !user) return res.status(401).json({ error: '유효한 토큰이 아닙니다' })

    // 메시지 조회 후 관련 상품 소유자 확인
    const { data: msg, error: mErr } = await supabase.from('messages').select('product_id').eq('id', id).single()
    if (mErr) throw mErr
    const { data: product } = await supabase.from('products').select('owner_id').eq('id', msg.product_id).single()
    if (!product || product.owner_id !== user.id) return res.status(403).json({ error: '권한 없음' })

    const { data, error } = await supabase.from('messages').update({ status }).eq('id', id).select('*')
    if (error) throw error
    res.json({ ok: true, item: data?.[0] })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
