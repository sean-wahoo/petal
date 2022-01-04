import type { NextApiRequest, NextApiResponse } from 'next'
import connection from 'lib/db'
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  await connection.connect()
  const results = await connection.query('desc users')
  console.log(results)
}
