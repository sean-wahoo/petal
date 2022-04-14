import type { NextApiRequest, NextApiResponse } from 'next'
import { LogoutData } from 'lib/types'
import { PrismaClient } from '@prisma/client'

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const prisma = new PrismaClient()

    const { user_id }: LogoutData = JSON.parse(req.body)

    await prisma.users.update({
      where: { user_id: user_id },
      data: { session_id: null },
    })
    return res.status(200).json({})
  } catch (e: any) {
    console.log({ e })
    return res
      .status(500)
      .json({ is_error: true, error_code: e.code, error_message: e.message })
  }
}
