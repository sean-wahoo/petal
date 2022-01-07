import type { NextApiRequest, NextApiResponse } from 'next'
import connection from 'lib/db'

export default async function checkSessionExists(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connection.connect()
    const { session_id }: { [k: string]: string } = JSON.parse(req.body)

    const [foundSession] = await connection.query(
      'SELECT COUNT(session_id) FROM users WHERE session_id = ?',
      [session_id]
    )
    console.log(foundSession)

    return res.json({ foundSession })
  } catch (e: any) {
    console.log({ e })
  }
}
