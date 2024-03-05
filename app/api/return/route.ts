import type { NextApiRequest, NextApiResponse } from "next";

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const eventData = req.body;

    console.log("Received webhook event:", eventData);
    res.status(200).send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
    res.status(500).send("Ошибка сервера");
  }
}
