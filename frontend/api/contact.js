import sql from 'mssql';
import nodemailer from 'nodemailer';

// ── Azure SQL config (set these in Vercel Environment Variables) ──────────────
const sqlConfig = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Reuse pool across warm invocations
let poolPromise = null;

function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(sqlConfig).catch((err) => {
      poolPromise = null; // reset so next request retries
      throw err;
    });
  }
  return poolPromise;
}

async function ensureTable(pool) {
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM sysobjects WHERE name='contact_submissions' AND xtype='U'
    )
    CREATE TABLE contact_submissions (
      id                NVARCHAR(36)  NOT NULL PRIMARY KEY,
      name              NVARCHAR(255) NOT NULL DEFAULT '',
      email             NVARCHAR(255) NOT NULL,
      race              NVARCHAR(255) NOT NULL DEFAULT '',
      newsletter        BIT           NOT NULL DEFAULT 0,
      email_sent        BIT           NOT NULL DEFAULT 0,
      subscribed_to_kit BIT           NOT NULL DEFAULT 0,
      submitted_at      DATETIME2     NOT NULL
    )
  `);
}

// ── Handler ───────────────────────────────────────────────────────────────────
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

  // ── 1. Save to Azure SQL ────────────────────────────────────────────────────
  const id = crypto.randomUUID();
  const submittedAt = new Date();
  let pool = null;

  try {
    pool = await getPool();
    await ensureTable(pool);

    await pool
      .request()
      .input('id', sql.NVarChar(36), id)
      .input('name', sql.NVarChar(255), name)
      .input('email', sql.NVarChar(255), email)
      .input('race', sql.NVarChar(255), race)
      .input('newsletter', sql.Bit, newsletter ? 1 : 0)
      .input('submitted_at', sql.DateTime2, submittedAt)
      .query(`
        INSERT INTO contact_submissions
          (id, name, email, race, newsletter, email_sent, subscribed_to_kit, submitted_at)
        VALUES
          (@id, @name, @email, @race, @newsletter, 0, 0, @submitted_at)
      `);
  } catch (err) {
    console.error('Azure SQL insert failed:', err);
    // Non-fatal — log and continue so the user still gets a response
  }

  // ── 2. Kit newsletter subscription ─────────────────────────────────────────
  const kitApiKey = process.env.KIT_API_KEY;
  if (newsletter && kitApiKey) {
    try {
      const firstName = name ? name.split(' ')[0] : undefined;
      const kitRes = await fetch('https://api.kit.com/v4/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': kitApiKey,
        },
        body: JSON.stringify({
          email_address: email,
          first_name: firstName,
          fields: { source: 'EST-website' },
        }),
      });
      if (!kitRes.ok) {
        console.error('Kit API error:', kitRes.status, await kitRes.text());
      } else if (pool) {
        await pool
          .request()
          .input('id', sql.NVarChar(36), id)
          .query('UPDATE contact_submissions SET subscribed_to_kit = 1 WHERE id = @id');
      }
    } catch (err) {
      console.error('Failed to subscribe to Kit:', err);
    }
  } else if (newsletter && !kitApiKey) {
    console.warn('Newsletter opt-in received but KIT_API_KEY is not set');
  }

  // ── 3. Email notification ───────────────────────────────────────────────────
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

      if (pool) {
        await pool
          .request()
          .input('id', sql.NVarChar(36), id)
          .query('UPDATE contact_submissions SET email_sent = 1 WHERE id = @id');
      }
    } catch (err) {
      console.error('Failed to send contact email:', err);
    }
  } else {
    console.log('Contact submission (SMTP not configured):', { name, email, race, newsletter });
  }

  return res.status(200).json({ message: 'Inbox updated. We will be in touch within one business day.' });
}
