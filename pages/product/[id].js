import { useEffect, useState } from 'react'
import supabase from '../../lib/browserSupabase'
import { useRouter } from 'next/router'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState(null)
  const [contact, setContact] = useState('')
  const [msg, setMsg] = useState('')
  const [status, setStatus] = useState('')

  useEffect(()=>{
    if (!id) return
    async function load() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (!error) setItem(data)
      // increment view via api
      await fetch('/api/view', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ id }) })
    }
    load()
  },[id])

  async function sendMessage(e){
    e.preventDefault()
    if (!msg) return setStatus('메시지를 입력하세요')
    setStatus('전송 중...')
    const res = await fetch('/api/message', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ product_id: id, contact, message: msg }) })
    const json = await res.json()
    if (res.ok) {
      setStatus('전송 완료 — 판매자에게 연락이 전달됩니다.')
      setContact('')
      setMsg('')
    } else {
      setStatus(json.error || '전송 실패')
    }
  }

  if (!item) return <div>로딩...</div>
  return (
    <main style={{padding:20}}>
      <h1>{item.title}</h1>
      <p>{item.desc}</p>
      <div>
        <a href={item.file_url} target="_blank" rel="noreferrer">미리보기</a>
      </div>
      <div>조회수: {item.views}</div>
      <div style={{marginTop:12}}>
        <button onClick={async ()=>{
          const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ productId: item.id }) })
          const json = await res.json()
          if (json.url) window.location.href = json.url
          else alert('결제 세션 생성 실패')
        }}>구매하기</button>
      </div>

      <hr />
      <h3>판매자에게 문의하기</h3>
      <form onSubmit={sendMessage} style={{maxWidth:600}}>
        <div>
          <label>연락처(이메일 또는 전화) — 선택</label>
          <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="이메일 또는 전화" />
        </div>
        <div>
          <label>메시지</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} required />
        </div>
        <button type="submit">문의 전송</button>
      </form>
      <div>{status}</div>
    </main>
  )
}
