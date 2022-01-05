import type { NextApiRequest, NextApiResponse } from 'next'
import connection from 'lib/db'
export default async function login(req: NextApiRequest, res: NextApiResponse) {
  interface LoginData {
    email: string
    password: string
  }

  try {
    await connection.connect()

    const { email, password }: LoginData = JSON.parse(req.body)

    if (email.length === 0 || password.length === 0) {
      throw new Error('Please provide a email and password!')
    }

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!email.toLowerCase().match(emailPattern)) {
      throw new Error('Please provide a valid email address!')
    }
    const [[[numRowsWithEmail]]]: any = await connection.query(
      'SELECT COUNT(*) FROM users WHERE email = ?',
      [email]
    )
    if (numRowsWithEmail === 0) {
      throw new Error('No user with that email exists!')
    }
  } catch (e: any) {
    console.log(e)
    res.status(500).json({ error_code: e.code, error_message: e.message })
  }
}
