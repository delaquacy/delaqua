// app/api/return/route.ts или pages/api/return/route.ts (убедитесь, что путь правильный)

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Обработка POST запроса
    const eventData = req.body;
    console.log("Received webhook event:", eventData);

    res.status(200).json({ message: "Event received" });
  } else {
    // Обработка всех остальных методов
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method Not Allowed`);
  }
}
