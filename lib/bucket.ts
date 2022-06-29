import * as AWS from "aws-sdk";

const bucket = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});

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
    const image_url: string = bucketData.Location;
    return [{ user_id, image_url }, null]
  } catch (e: any) {
    console.error({ e });
    return [null, e];
  }
};
