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

    console.log("Received webhook event:", eventData);
    const postData = {
      orderId: eventData.order_id,
      orderData: eventData.events,
    };
    await axios.post(link, postData, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    res.status(200).send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
