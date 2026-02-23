const formidable = require('formidable')
const fs = require('fs')
const crypto = require('crypto')
const supabase = require('../../../lib/supabaseAdmin')
const { createCertificatePdf } = require('../../../lib/pdfCert')

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message })
    try {
      const title = fields.title || '무제'
      const desc = fields.desc || ''
      const file = files.file
      const buffer = fs.readFileSync(file.filepath || file.path)
      const hash = crypto.createHash('sha256').update(buffer).digest('hex')

      // 인증 토큰이 전달되면 사용자 정보로 소유자(판매자) 설정
      let owner_id = null
      let owner_email = null
      const authHeader = req.headers.authorization || req.headers.Authorization
      const token = authHeader ? (authHeader.split(' ')[1] || null) : (fields.access_token || null)
      if (token) {
        try {
          const { data: { user }, error: userErr } = await supabase.auth.getUser(token)
          if (!userErr && user) {
            owner_id = user.id
            owner_email = user.email || null
          }
        } catch (e) {
          // 무시: 인증 정보 없어도 업로드는 허용됨(비회원 업로드)
        }
      }

      // upload file to supabase storage (admin client)
      const bucket = 'public-ideas'
      await supabase.storage.createBucket(bucket, { public: true }).catch(()=>{})
      const fileName = `${Date.now()}-${file.originalFilename || file.name}`
      const { data: uploadData, error: uploadErr } = await supabase.storage.from(bucket).upload(fileName, buffer, { contentType: file.mimetype || file.type })
      if (uploadErr) throw uploadErr
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`

      const timestamp = new Date().toISOString()
      // create PDF certificate
      const pdfBuffer = await createCertificatePdf({ title, author: '작성자(미인증)', timestamp, hash })
      const certName = `${Date.now()}-cert.pdf`
      await supabase.storage.from(bucket).upload(certName, pdfBuffer)

      // insert into products table (owner 정보 포함)
      const insertObj = { title, desc, file_path: fileName, file_url: publicUrl, hash, created_at: timestamp, views: 0 }
      if (owner_id) insertObj.owner_id = owner_id
      if (owner_email) insertObj.owner_email = owner_email
      const { data, error } = await supabase.from('products').insert([insertObj])
      if (error) throw error

      res.json({ ok: true, item: data?.[0] || null })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  })
}
