import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'active', endpoint: '/api/contact', method: 'POST' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name = '', email, race = '', newsletter = false } = req.body || {};

  if (!email) {
    return res.status(400).json({ detail: 'Email is required' });
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || smtpUser,
        to: process.env.EMAIL_TO || 'info@endurancesporttravel.com',
        subject: `Start Planning: ${name} — ${race}`,
        text: `Name: ${name}\nEmail: ${email}\nRace: ${race}\nNewsletter: ${newsletter}`,
      });
    } catch (err) {
      console.error('Failed to send contact email:', err);
    }
  } else {
    console.log('Contact submission (SMTP not configured):', { name, email, race, newsletter });
  }

  return res.status(200).json({ message: 'Inbox updated. We will be in touch within one business day.' });
}
