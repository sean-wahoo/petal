import type { NextApiRequest, NextApiResponse } from 'next'
import connection from 'lib/db'
import { LogoutData } from 'lib/types'

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connection.connect()

    const { user_id, session_id }: LogoutData = JSON.parse(req.body)
    console.log({ user_id, session_id })

    await connection.query(
      'UPDATE users SET session_id = NULL WHERE user_id = ? AND session_id = ?',
      [user_id, session_id]
    )
    return res.status(200).json({})
  } catch (e: any) {
    console.log({ e })
    return res
      .status(500)
      .json({ is_error: true, error_code: e.code, error_message: e.message })
  }
}
