import * as AWS from "aws-sdk";
import { PassThrough, Readable } from "stream";
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import sharp from 'sharp'

const bucket = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});

export const newConvertImage = (readable: Readable) => {
  const passthrough = new PassThrough()
  ffmpeg()
    .input(readable)
    .outputFormat('webp')
    .stream(passthrough, { end: true })
  return passthrough;
}

export const convertImage = async (image: Readable, outputFormat: string) => {
  console.log({ image })
  const p = new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const passThrough = new PassThrough()
    const newImage = ffmpeg()
      .input(image)
      .outputFormat(outputFormat)
      // .on('start', () => console.log('start'))
      // .on('progress', () => console.log('progress...'))
      // .on('error', (e) => console.log(e))
      // .pipe(res, { end: true })
      // .on('error', reject)
      .stream(passThrough, { end: true })
    passThrough.on('data', data => {
      chunks.push(data)
      console.log({ data })
    })
    passThrough.on('error', reject)
    passThrough.on('end', () => {
      const originalImage = Buffer.concat(chunks);
      const editedImage = originalImage
      // .copyWithin(4, -4)
      // .slice(0, -4)
      return resolve(editedImage)
    })
    resolve(newImage)
  })
  p.then(editedImage => {
    console.log({ editedImage })
  }).catch(e => {
    console.log({ e })
  })
}

export const bufferToStream = (buffer: Buffer): Readable => {
  const readable = new Readable();
  readable._read = () => { }
  readable.push(buffer)
  readable.push(null)
  console.log({ readable })
  return readable
}

export const upload = async (file: Buffer, folder: string, user_id: string) => {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
      Key: `${folder}/${user_id}.webp`,
      Body: file,
      ACL: "public-read",
      ContentType: 'image/webp'
    };
    const bucketData = await bucket.upload(params).promise();
    const image_url = bucketData.Location;
    return [{ user_id, image_url }]
  } catch (e: any) {
    console.error({ e });
    return [null, e];
  }
};
