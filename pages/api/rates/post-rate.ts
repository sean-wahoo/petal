import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function postRate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const { rateKind, userRateId, postRateId, removeRate } = JSON.parse(
      req.body
    );

    if (removeRate) {
      const data = await prisma.postRate.delete({
        where: {
          userRateId_postRateId: {
            userRateId,
            postRateId,
          },
        },
      });
      return res.status(200).json({ message: "success-rate-delete", data });
    }
    const data = await prisma.postRate.upsert({
      create: {
        rateKind,
        userRateId,
        postRateId,
      },
      update: {
        rateKind,
      },
      where: {
        userRateId_postRateId: {
          userRateId,
          postRateId,
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
