import type { NextApiRequest, NextApiResponse } from "next";

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const eventData = req.body;
  console.log("Received webhook event:", eventData);

  res.status(200).json({ message: "Event received" });
}
