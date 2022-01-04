import { Client } from 'pg'

const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT as any,
  database: process.env.PGDATABASE,

  ssl: { rejectUnauthorized: false },
})

export default client
