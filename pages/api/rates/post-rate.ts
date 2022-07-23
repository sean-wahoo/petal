import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function postRate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { rate_kind, user_rate_id, post_rate_id, remove_rate } = req.body;

    console.log({ rate_kind, user_rate_id, post_rate_id, remove_rate });

    if (remove_rate) {
      const data = await prisma.post_rates.delete({
        where: {
          user_rate_id_post_rate_id: {
            user_rate_id,
            post_rate_id,
          },
        },
      });
      return res.status(200).json({ message: "success-rate-delete", data });
    }
    const data = await prisma.post_rates.upsert({
      create: {
        rate_kind,
        user_rate_id,
        post_rate_id,
      },
      update: {
        rate_kind,
      },
      where: {
        user_rate_id_post_rate_id: {
          user_rate_id,
          post_rate_id,
        },
      },
    });

    return res.status(200).json({ message: "success-rate-upsert", data });
  } catch (e: any) {
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
    });
  } finally {
    prisma.$disconnect();
  }
}
