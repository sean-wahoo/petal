import type { NextApiRequest, NextApiResponse } from "next";
import { convertImage, bufferToStream, upload, newConvertImage } from "lib/bucket";
import { PrismaClient } from "@prisma/client";
import fs from 'fs'
import sharp from "sharp";
import { Readable } from "stream"
import { IncomingForm } from 'formidable'
import micro from 'micro'

// export const config = {
//   api: {
//     bodyParser: false
//   }
// }

async function updateProfileImage(req: any, res: NextApiResponse) {
  const prisma = new PrismaClient();
  try {
    const user_id = req.query?.user_id;
    // const body = Buffer.from(req.body, 'base64')
    // console.log(typeof req.body)
    console.log(req.files)
    sharp(/* Buffer.from(req.body, 'base64') */req.body).webp().toBuffer((err, data) => console.log({ err, data }))
    const form = new IncomingForm({ keepExtensions: true, allowEmptyFiles: false })
    form.parse(req, (err, fields, files) => console.log({ err, fields, files }))
    // const readable = new Readable()
    // readable._read = () => {}
    // readable.push(body);
    // readable.push(null)
    // readable.pipe(fs.createWriteStream('./image.jpeg'))
    // sharp(Buffer.from(body)).toFile(`${user_id}.webp`, (err, info) => console.log({ err, info }))
    // const body = bufferToStream(req.body)
    // console.log({ body2: body })
    // const converted = await convertImage(body, 'webp')
    // const testConverted = newConvertImage(req.body);
    //
    // console.log({ testConverted })
    // console.log(Buffer.byteLength(converted))
    // const [data, error] = await upload(converted, 'profile_images', 'RCM7U0z4HC8')
    // console.log({ data, error })

    // const updated_user = await prisma.users.update({
    //   where: { user_id: data.user_id },
    //   data: { image_url: data.image_url },
    //   select: { email: true }
    // })

    // return res.json({ ...data, email: updated_user.email })
    return res.json({})
  }
  catch (e: any) {
    console.log({ e })
    res.status(500).json(e)
  }
  finally {
    prisma.$disconnect()
  }
}

export default updateProfileImage
