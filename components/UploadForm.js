import { useState } from 'react'

export default function UploadForm() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!file) return setMessage('파일을 선택해주세요')
    setLoading(true)
    const form = new FormData()
    form.append('title', title)
    form.append('desc', desc)
    form.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: form })
    const json = await res.json()
    setLoading(false)
    if (res.ok) setMessage('업로드 성공')
    else setMessage(json.error || '업로드 실패')
  }

  return (
    <form onSubmit={onSubmit} style={{maxWidth:700}}>
      <div>
        <label>상품명</label>
        <input value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label>설명</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} />
      </div>
      <div>
        <label>이미지 / 짧은 영상</label>
        <input type="file" accept="image/*,video/*" onChange={e=>setFile(e.target.files[0])} />
      </div>
      <button type="submit" disabled={loading}>{loading? '업로드 중...' : '업로드'}</button>
      <div>{message}</div>
    </form>
  )
}
