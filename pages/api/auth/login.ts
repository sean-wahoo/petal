import type { NextApiRequest, NextApiResponse } from "next";
import type { AuthData, LoginResponse } from "lib/types";
import { updateSession } from "lib/session";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password }: AuthData = req.body;

    if (email.length === 0 || password.length === 0) {
      throw { message: "Please provide a email and password!" };
    }

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.toLowerCase().match(emailPattern)) {
      throw { message: "Please provide a valid email address!", type: "email" };
    }
    const numRowsWithEmail = await prisma.users.findMany({
      where: { email: email },
    });

    if (numRowsWithEmail.length === 0) {
      throw { message: "No user with that email exists!", type: "email" };
    }

    if (
      !(await bcrypt.compare(password, numRowsWithEmail[0].password as string))
    ) {
      throw { message: "That password is incorrect!", type: "password" };
    }

    const session_data = {
      user_id: numRowsWithEmail[0].user_id,
      email,
      display_name: numRowsWithEmail[0].display_name,
      image_url: numRowsWithEmail[0].image_url,
    };
    const session_id = await updateSession(session_data);
    prisma.users.update({
      where: { user_id: numRowsWithEmail[0].user_id },
      data: { session_id: session_id as string },
    });
    return res.status(200).json({
      user_id: numRowsWithEmail[0].user_id,
      session_id,
    } as LoginResponse);
  } catch (e: any) {
    console.error({ e });
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
      type: e.type,
    } as LoginResponse);
  } finally {
    prisma.$disconnect();
  }
}
