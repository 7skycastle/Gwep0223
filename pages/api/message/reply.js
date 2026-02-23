const supabase = require('../../../../lib/supabaseAdmin')
const { sendMail } = require('../../../../lib/email')

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end()
    const { message_id, subject, body } = req.body
    if (!message_id || !body) return res.status(400).json({ error: 'message_id와 body 필요' })

    // 인증 및 소유자 확인
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader) return res.status(401).json({ error: '인증 필요' })
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !user) return res.status(401).json({ error: '유효한 토큰이 아닙니다' })

    // 메시지 조회
    const { data: msg, error: mErr } = await supabase.from('messages').select('*').eq('id', message_id).single()
    if (mErr) throw mErr

    // 상품 소유자 확인
    const { data: product } = await supabase.from('products').select('owner_id').eq('id', msg.product_id).single()
    if (!product || product.owner_id !== user.id) return res.status(403).json({ error: '권한 없음' })

    // recipient from message.contact (if present)
    if (!msg.contact) return res.status(400).json({ error: '연락처가 없어 이메일을 보낼 수 없습니다' })

    await sendMail({ to: msg.contact, subject: subject || '문의에 대한 답변', text: body })

    // 상태 업데이트
    await supabase.from('messages').update({ status: 'replied' }).eq('id', message_id)

    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
