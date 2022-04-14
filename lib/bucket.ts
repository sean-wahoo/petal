import * as AWS from 'aws-sdk'
const bucket = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
})
export const upload = async (file: File, folder: string, user_id: string) => {
  try {
    file = new File([file], `${user_id}.${file.name.split('.').at(-1)}`)
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
      Key: `${folder}/${file.name}`,
      Body: file,
    }
    console.log({ params })
    bucket.upload(params, (err: any, data: any) => {
      console.log({ err, data })
    })
  } catch (e: any) {
    console.log({ e })
  }
}
