import type { NextApiRequest, NextApiResponse } from 'next'
import type { AuthData, LoginSuccess, LoginError } from 'lib/types'
import { updateSession } from 'lib/session'
import connection from 'lib/db'
import bcrypt from 'bcrypt'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connection.connect()

    const { email, password }: AuthData = JSON.parse(req.body)

    if (email.length === 0 || password.length === 0) {
      throw new Error('Please provide a email and password!')
    }

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!email.toLowerCase().match(emailPattern)) {
      throw new Error('Please provide a valid email address!')
    }
    const [numRowsWithEmail]: any = await connection.query(
      'SELECT user_id, password FROM users WHERE email = ?',
      [email]
    )

    if (numRowsWithEmail.length === 0) {
      throw new Error('No user with that email exists!')
    }

    if (!(await bcrypt.compare(password, numRowsWithEmail[0][1]))) {
      throw new Error('That password is incorrect!')
    }
    const session_id = await updateSession(numRowsWithEmail[0][0], email)

    await connection.query(
      'UPDATE users SET session_id = ? WHERE user_id = ?',
      [session_id, numRowsWithEmail[0][0]]
    )

    return res
      .status(200)
      .json({ user_id: numRowsWithEmail[0][0], session_id } as LoginSuccess)
  } catch (e: any) {
    console.log({ e })
    res
      .status(500)
      .json({
        is_error: true,
        error_code: e.code,
        error_message: e.message,
      } as LoginError)
  }
}
