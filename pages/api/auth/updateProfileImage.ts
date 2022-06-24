import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function updateProfileImage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { user_id, image_url } = req.body

    const updated = await prisma.users.update({
      where: { user_id: user_id },
      data: { image_url },
      select: { email: true },
    })
    return res.status(200).json({ user_id, image_url, email: updated.email })
  } catch (e: any) {
    console.log({ errorAtPatchRoute: e})

    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
      type: e.type,
    })
  } finally {
    prisma.$disconnect();
  }
}
