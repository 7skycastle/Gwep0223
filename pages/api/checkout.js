import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = require('../../lib/supabaseAdmin')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { productId } = req.body
    if (!productId) return res.status(400).json({ error: 'productId 필요' })

    const { data: product, error } = await supabase.from('products').select('*').eq('id', productId).single()
    if (error || !product) return res.status(404).json({ error: '상품을 찾을 수 없습니다' })

    // 금액은 임시로 1000원 (원 단위) — 실제 서비스는 금액 필드 필요
    const amount = 1000

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'krw', product_data: { name: product.title }, unit_amount: amount }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${productId}?paid=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/product/${productId}`
    })

    res.json({ ok: true, url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
