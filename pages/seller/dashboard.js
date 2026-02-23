import { useEffect, useState } from 'react'
import supabase from '../../lib/browserSupabase'

export default function SellerDashboard(){
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState({})

  useEffect(()=>{
    async function init(){
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
      const { data } = await supabase.from('products').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
      setProducts(data || [])
    }
    init()
  },[])

  async function loadMessages(product_id){
    const token = (await supabase.auth.getSession())?.data?.session?.access_token
    const res = await fetch(`/api/messages?product_id=${product_id}`, { headers: { Authorization: `Bearer ${token}` } })
    const json = await res.json()
    if (json.ok) setMessages(prev=> ({...prev, [product_id]: json.items}))
  }

  async function updateStatus(msgId, status){
    const token = (await supabase.auth.getSession())?.data?.session?.access_token
    const res = await fetch('/api/message/update', { method:'PATCH', headers: {'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ id: msgId, status }) })
    const json = await res.json()
    if (json.ok) {
      // refresh
      const prodId = json.item.product_id
      loadMessages(prodId)
    }
  }

  async function replyMessage(msgId, contact){
    const token = (await supabase.auth.getSession())?.data?.session?.access_token
    const subject = prompt('답장 제목을 입력하세요')
    const body = prompt('답장 내용을 입력하세요')
    if (!body) return
    const res = await fetch('/api/message/reply', { method:'POST', headers: {'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({ message_id: msgId, subject, body }) })
    const json = await res.json()
    if (json.ok) alert('응답 이메일 발송 완료')
  }

  if (!user) return <div>판매자 로그인이 필요합니다</div>
  return (
    <main style={{padding:20}}>
      <h1>판매자 대시보드</h1>
      <h2>내 상품</h2>
      <ul>
        {products.map(p=> (
          <li key={p.id} style={{marginBottom:12}}>
            <strong>{p.title}</strong> — 조회수 {p.views}
            <div><button onClick={()=>loadMessages(p.id)}>문의 불러오기</button></div>
            <div>
              {(messages[p.id]||[]).map(m=> (
                <div key={m.id} style={{border:'1px solid #ddd',padding:8,marginTop:6}}>
                  <div>{m.message}</div>
                  <div>연락처: {m.contact || '없음'}</div>
                  <div>상태: {m.status}</div>
                  <div>
                    <button onClick={()=>updateStatus(m.id,'read')}>읽음</button>
                    <button onClick={()=>updateStatus(m.id,'closed')}>종료</button>
                    <button onClick={()=>replyMessage(m.id,m.contact)}>회신</button>
                  </div>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
