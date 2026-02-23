import { useState } from 'react'
import supabase from '../lib/browserSupabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else setMessage('로그인 성공')
  }

  return (
    <main style={{padding:20}}>
      <h1>로그인</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>이메일</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit">로그인</button>
      </form>
      <div>{message}</div>
    </main>
  )
}
