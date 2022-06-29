import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log({ query: req.query })
  if (req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid revalidation token!" })
  }
  try {
    await res.revalidate(req.query.path as string)
    return res.json({ revalidated: true })
  }
  catch (e: any) {
    console.log({ e })
    return res.status(500).json({ message: "Error revalidating! "})
  }
}
