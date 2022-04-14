import faker from '@faker-js/faker'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { AuthData, RegisterSuccess, RegisterError } from 'lib/types'
import { updateSession } from 'lib/session'
import connection from 'lib/db'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid/async'
import { PrismaClient } from '@prisma/client'

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const prisma = new PrismaClient()
    const { email, password }: AuthData = JSON.parse(req.body)

    if (email.length === 0 || password.length === 0) {
      throw { message: 'Please provide an email and password!' }
    }

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!email.toLowerCase().match(emailPattern)) {
      throw { message: 'Please provide a valid email address!', type: 'email' }
    }
    const numRowsWithEmail = await prisma.users.findMany({
      where: { email: email },
    })

    if (numRowsWithEmail.length > 0) {
      throw { message: 'That email is already in use!', type: 'email' }
    }

    const user_id = await nanoid(11)
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    const seed = await nanoid(16)
    const image_url = `https://avatars.dicebear.com/api/bottts/${seed}.svg`
    const display_name = faker.internet.userName()
    const session_id = await updateSession({
      user_id,
      email,
      image_url,
      display_name,
    })

    await prisma.users.create({
      data: {
        user_id,
        email,
        password: hash,
        session_id: session_id as string,
        image_url,
        display_name,
      },
    })

    return res.status(200).json({ user_id, session_id } as RegisterSuccess)
  } catch (e: any) {
    res.status(500).json({
      is_error: true,
      error_code: e.code,
      error_message: e.message,
      type: e.type,
    } as RegisterError)
  }
}
