import type { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
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
