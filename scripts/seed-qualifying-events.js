// Run from project root: node scripts/seed-qualifying-events.js
// Requires: npm install mssql dotenv  (or run from frontend/ where mssql is already installed)

import 'dotenv/config';
import sql from 'mssql';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load backend .env if env vars aren't already set
if (!process.env.AZURE_SQL_SERVER) {
  const { config } = await import('dotenv');
  config({ path: join(__dirname, '../backend/.env') });
}

const sqlConfig = {
  server: process.env.AZURE_SQL_SERVER   || 'endurancesporttraveldb.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'free-sql-db-8836662',
  user: process.env.AZURE_SQL_USER       || 'estadmin',
  password: process.env.AZURE_SQL_PASSWORD,
  port: 1433,
  options: { encrypt: true, trustServerCertificate: false },
};

const events = [
  // Completed qualifiers
  { event_name: 'IRONMAN Wales',              city: 'Tenby',              country: 'United Kingdom', race_date: '2025-09-21' },
  { event_name: 'IRONMAN Chattanooga',        city: 'Chattanooga',        country: 'USA',            race_date: '2025-09-28' },
  { event_name: 'IRONMAN Arizona',            city: 'Tempe',              country: 'USA',            race_date: '2025-11-16' },
  { event_name: 'IRONMAN Cozumel',            city: 'Cozumel',            country: 'Mexico',         race_date: '2025-11-23' },
  { event_name: 'IRONMAN Western Australia',  city: 'Busselton',          country: 'Australia',      race_date: '2025-12-07' },
  { event_name: 'IRONMAN New Zealand',        city: 'Taupō',              country: 'New Zealand',    race_date: '2026-03-07' },
  { event_name: 'IRONMAN Texas',              city: 'The Woodlands',      country: 'USA',            race_date: '2026-04-18' },
  { event_name: 'IRONMAN South Africa',       city: 'Nelson Mandela Bay', country: 'South Africa',   race_date: '2026-04-19' },
  { event_name: 'IRONMAN Lanzarote',          city: 'Lanzarote',          country: 'Spain',          race_date: '2026-05-23' },
  // Upcoming qualifiers
  { event_name: 'IRONMAN Brazil',             city: 'Florianópolis',      country: 'Brazil',         race_date: '2026-05-31' },
  { event_name: 'IRONMAN Hamburg',            city: 'Hamburg',            country: 'Germany',        race_date: '2026-06-07' },
  { event_name: 'IRONMAN Cairns',             city: 'Cairns',             country: 'Australia',      race_date: '2026-06-14' },
  { event_name: 'IRONMAN Kärnten-Klagenfurt', city: 'Klagenfurt',         country: 'Austria',        race_date: '2026-06-14' },
  { event_name: 'IRONMAN Frankfurt',          city: 'Frankfurt',          country: 'Germany',        race_date: '2026-06-28' },
  { event_name: 'IRONMAN Switzerland Thun',   city: 'Thun',               country: 'Switzerland',    race_date: '2026-07-05' },
  { event_name: 'IRONMAN Lake Placid',        city: 'Lake Placid',        country: 'USA',            race_date: '2026-07-19' },
  { event_name: 'IRONMAN Kalmar',             city: 'Kalmar',             country: 'Sweden',         race_date: '2026-08-15' },
];

async function run() {
  console.log('Connecting to Azure SQL...');
  const pool = await sql.connect(sqlConfig);

  // Create table
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ironman_qualifying_events' AND xtype='U')
    CREATE TABLE ironman_qualifying_events (
      id         INT           IDENTITY(1,1) PRIMARY KEY,
      event_name NVARCHAR(255) NOT NULL,
      city       NVARCHAR(255) NOT NULL,
      country    NVARCHAR(255) NOT NULL,
      race_date  DATE          NULL
    )
  `);
  console.log('Table ready.');

  // Check if already seeded
  const { recordset } = await pool.request().query('SELECT COUNT(*) AS cnt FROM ironman_qualifying_events');
  if (recordset[0].cnt > 0) {
    console.log(`Table already has ${recordset[0].cnt} rows — skipping insert.`);
    await pool.close();
    return;
  }

  // Insert events
  for (const e of events) {
    await pool.request()
      .input('event_name', sql.NVarChar(255), e.event_name)
      .input('city',       sql.NVarChar(255), e.city)
      .input('country',    sql.NVarChar(255), e.country)
      .input('race_date',  sql.Date,          e.race_date)
      .query(`INSERT INTO ironman_qualifying_events (event_name, city, country, race_date)
              VALUES (@event_name, @city, @country, @race_date)`);
    console.log(`  ✓ ${e.event_name} — ${e.city}, ${e.country}`);
  }

  console.log(`\nDone — ${events.length} qualifying events inserted.`);
  await pool.close();
}

run().catch(err => { console.error(err); process.exit(1); });
