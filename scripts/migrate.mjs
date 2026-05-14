import { readFileSync } from 'fs'
import pg from 'pg'

const { Client } = pg

// Connection using Supabase connection pooler (port 6543) or direct (5432)
const client = new Client({
  connectionString: `postgresql://postgres.zeafcvbxmtrkcmgjlggq:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  ssl: { rejectUnauthorized: false },
})

const sql = readFileSync('./supabase/migrations/001_initial.sql', 'utf8')

async function run() {
  try {
    await client.connect()
    console.log('Connected to Supabase PostgreSQL')
    await client.query(sql)
    console.log('✓ Migration applied successfully')
  } catch (err) {
    console.error('Migration error:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()
