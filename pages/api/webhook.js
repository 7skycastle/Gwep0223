import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = require('../../lib/supabaseAdmin')
import rawBody from 'raw-body'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const sig = req.headers['stripe-signature']
  const body = await rawBody(req)
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    // metadata나 성공 처리 로직 추가 가능
    console.log('결제 완료:', session.id)
  }

  res.json({ received: true })
}
