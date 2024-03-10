import axios from "axios";
import type { NextApiResponse } from "next";
import { NextRequest } from "next/server";

const link =
  "https://script.google.com/macros/s/AKfycbz2IdNKqrkMPE9c7SFnBRp4A-rqP2MLIlaHqjabq_yf_1muCtol5nzWLtKSj6MmdNddjQ/exec";

export async function POST(
  req: NextRequest,
  res: NextApiResponse<string>
): Promise<void> {
  const now = new Date();
  const formattedDateTime = now
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  try {
    const eventData = await req.json();

    const postData = {
      event: eventData.event,
      order_id: eventData.order_id,
      date_time: formattedDateTime,
    };
    await axios.post(link, postData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(postData);
    res.statusCode = 200;
    res.send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
