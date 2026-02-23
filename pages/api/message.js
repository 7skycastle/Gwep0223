const supabase = require('../../../lib/supabaseAdmin')
const { sendMail } = require('../../../lib/email')

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end()
    const { product_id, contact, message, sender_id } = req.body
    if (!product_id || !message) return res.status(400).json({ error: 'product_id와 message가 필요합니다.' })

    // 메시지 저장
    const payload = {
      product_id,
      contact: contact || null,
      message,
      sender_id: sender_id || null,
      status: 'new',
      created_at: new Date().toISOString()
    }
    const { data, error } = await supabase.from('messages').insert([payload])
    if (error) throw error

    // 상품의 판매자 이메일 조회
    const { data: product } = await supabase.from('products').select('owner_email, title').eq('id', product_id).single()
    if (product && product.owner_email) {
      // 이메일 알림 전송(비동기)
      try {
        await sendMail({
          to: product.owner_email,
          subject: `[문의] ${product.title} 에 대한 새로운 문의가 도착했습니다`,
          text: `새로운 문의:
메시지: ${message}
연락처: ${contact || '없음'}
상품: ${product.title}`
        })
      } catch (e) {
        // 이메일 실패는 치명적이지 않음
        console.warn('이메일 전송 실패:', e.message)
      }
    }

    res.json({ ok: true, message: data?.[0] })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
