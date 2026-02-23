import dynamic from 'next/dynamic'
import UploadForm from '../components/UploadForm'
import { useState, useEffect } from 'react'

export default function Home({}) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [items, setItems] = useState([])

  useEffect(()=>{ load() }, [])
  async function load(){
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`)
    const json = await res.json()
    if (json.ok) setItems(json.items)
  }

  return (
    <main style={{padding:20,fontFamily:'Arial'}}>
      <h1>아이디어 마켓 (가상)</h1>
      <p>상품을 업로드하면 저작권 증명(PDF)과 함께 저장됩니다.</p>
      <UploadForm />
      <hr />
      <h2>검색</h2>
      <div>
        <input placeholder="검색어" value={q} onChange={e=>setQ(e.target.value)} />
        <input placeholder="카테고리" value={category} onChange={e=>setCategory(e.target.value)} />
        <button onClick={load}>검색</button>
      </div>
      <h2>결과</h2>
      <ul>
        {items.map(it=> (<li key={it.id}><a href={`/product/${it.id}`}>{it.title}</a> — {it.category || '카테고리 없음'}</li>))}
      </ul>
      <hr />
      <h2>랭킹</h2>
      <p>일간 / 주간 / 월간 인기 페이지는 상단의 랭킹 페이지에서 확인하세요.</p>
    </main>
  )
}
