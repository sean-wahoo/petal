import type { NextApiRequest, NextApiResponse } from 'next'
import connection from 'lib/db'

export default async function destroySession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connection.connect()
    const { session_id }: { [k: string]: string } = JSON.parse(req.body)

    await connection.query(
      'UPDATE users SET session_id = NULL WHERE session_id = ?',
      [session_id]
    )
    console.log('yes')
    return res.status(200).json({ message: 'yea' })
  } catch (e: any) {
    console.log({ e })
  }
}
