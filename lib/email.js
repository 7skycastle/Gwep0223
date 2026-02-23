const nodemailer = require('nodemailer')

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) {
    throw new Error('SMTP 환경변수가 설정되어 있지 않습니다')
  }
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
}

async function sendMail({ to, subject, text, html }) {
  const transporter = getTransporter()
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER
  const info = await transporter.sendMail({ from, to, subject, text, html })
  return info
}

module.exports = { sendMail }
