const PDFDocument = require('pdfkit')
const getStream = require('get-stream')

async function createCertificatePdf({ title, author, timestamp, hash }) {
  const doc = new PDFDocument()
  doc.fontSize(20).text('저작권 증명서', { align: 'center' })
  doc.moveDown()
  doc.fontSize(14).text(`상품명: ${title}`)
  doc.text(`작성자: ${author}`)
  doc.text(`등록시각: ${new Date(timestamp).toLocaleString('ko-KR')}`)
  doc.moveDown()
  doc.text(`SHA-256 해시: ${hash}`)
  doc.end()
  const buffer = await getStream.buffer(doc)
  return buffer
}

module.exports = { createCertificatePdf }
