import * as AWS from "aws-sdk";

const bucket = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});

/**
 *
 * Uploads a file to a storage bucket on AWS S3
 *
 * @param file File to upload
 * @param foler Folder on S3 to upload to
 * @param user_id User's ID to name the file as
 *
 * @returns User's ID + URL path for the image OR error
 *
 */
export const upload = async (file: Buffer, folder: string, id: string) => {
  try {
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
      Key: `${folder}/${id}.webp`,
      Body: file,
      ACL: "public-read",
      ContentType: "image/webp",
    };
    const bucketData = await bucket.upload(params).promise();
    const image: string = bucketData.Location;
    return [{ id, image }, null];
  } catch (e: any) {
    console.error({ e });
    return [null, e];
  }
};
