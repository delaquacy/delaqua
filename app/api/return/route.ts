import { getCurrentUserId } from "@/app/lib/config";
import { formattedDateTime } from "@/app/utils/formUtils";
import axios from "axios";
import type { NextApiResponse } from "next";
import { NextRequest } from "next/server";

const link =
  "https://script.google.com/macros/s/AKfycbz2IdNKqrkMPE9c7SFnBRp4A-rqP2MLIlaHqjabq_yf_1muCtol5nzWLtKSj6MmdNddjQ/exec";

const result = async (orderId: string) => {
  try {
    const response = await fetch(`/api/back/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const nest = await response.json();
    console.log("Back", nest);
  } catch (error) {
    console.error("Ошибка при получении данных о заказе:", error);
  }
};
export async function POST(
  req: NextRequest,
  res: NextApiResponse<string>
) {
  try {
    const eventData = await req.json();
    const userId = getCurrentUserId();
    console.log(userId);
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
    await result(eventData.order_id);
    console.log(eventData);
    res.status(200).send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
