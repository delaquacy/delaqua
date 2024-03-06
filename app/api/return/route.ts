import axios from "axios";
import type { NextApiResponse } from "next";
import { NextRequest } from "next/server";

const link =
  "https://script.google.com/macros/s/AKfycbyel0dQkmNWQpP-qq7ajQ_Mwib8m3K9gJnHEJy5Bk1zfq4r2GY10SxceJBvj8I7Qz1E/exec";

export async function POST(
  req: NextRequest,
  res: NextApiResponse<string>
) {
  try {
    const eventData = await req.json();
    const now = new Date();

    const formattedDateTime = now
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
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
    console.log(eventData);
    res.status(200).send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
