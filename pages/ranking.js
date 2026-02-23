import { useEffect, useState } from 'react'
import supabase from '../lib/browserSupabase'

export default function Ranking() {
  const [period, setPeriod] = useState('day')
  const [items, setItems] = useState([])

  useEffect(()=>{
    async function load(){
      const res = await fetch(`/api/products?period=${period}`)
      const json = await res.json()
      if (json.ok) setItems(json.items)
    }
    load()
  },[period])

  return (
    <main style={{padding:20}}>
      <h1>인기 상품</h1>
      <div>
        <button onClick={()=>setPeriod('day')}>일간</button>
        <button onClick={()=>setPeriod('week')}>주간</button>
        <button onClick={()=>setPeriod('month')}>월간</button>
      </div>
      <ul>
        {items.map(it=> (<li key={it.id}><a href={`/product/${it.id}`}>{it.title}</a> — 조회수 {it.views}</li>))}
      </ul>
    </main>
  )
}
