import { generateUsername } from "unique-username-generator";
import type { NextApiRequest, NextApiResponse } from "next";
import type { AuthData, RegisterResponse } from "lib/types";
import { updateSessionDataRedis } from "lib/session";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid/async";
import { PrismaClient } from "@prisma/client";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  try {
    const { email, password }: AuthData = req.body;

    if (email.length === 0 || password.length === 0) {
      throw { message: "Please provide an email and password!" };
    }

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.toLowerCase().match(emailPattern)) {
      throw { message: "Please provide a valid email address!", type: "email" };
    }

    const numRowsWithEmail = await prisma.users.findMany({
      where: { email: email },
    });

    if (numRowsWithEmail.length > 0) {
      throw { message: "That email is already in use!", type: "email" };
    }

    const user_id = await nanoid(11);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const seed = await nanoid(16);
    const image_url = `https://avatars.dicebear.com/api/bottts/${seed}.svg`;
    const cache_key = await nanoid(12);
    const display_name = generateUsername();
    const session_data = {
      user_id,
      email,
      cache_key,
      been_welcomed: false,
      display_name,
      image_url,
    };
    await updateSessionDataRedis(session_data);

    await prisma.users.create({
      data: {
        user_id,
        email,
        password: hash,
        cache_key,
        image_url,
        display_name,
      },
    });

    return res.status(200).json(session_data);
  } catch (e: any) {
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
      type: e.type,
    } as RegisterResponse);
  } finally {
    prisma.$disconnect();
  }
}
