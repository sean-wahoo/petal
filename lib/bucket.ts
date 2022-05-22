import * as AWS from "aws-sdk";
import axios from "axios";
const bucket = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET,
});
export const upload = async (file: File, folder: string, user_id: string) => {
  try {
    file = new File([file], `${user_id}.${file.name.split(".").at(-1)}`);
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
      Key: `${folder}/${file.name}`,
      Body: file,
      ACL: "public-read",
    };
    const bucketData = await bucket.upload(params).promise();
    const image_url = bucketData.Location;
    const { data } = await axios.patch("/api/auth/updateProfileImage", {
      user_id,
      image_url,
    });
    return [{ email: data.email, user_id: data.user_id, image_url }, null];
  } catch (e: any) {
    console.error({ e });
    return [null, e];
  }
};
