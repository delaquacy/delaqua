import axios from "axios";
import type { NextApiResponse } from "next";
import { NextRequest } from "next/server";

const link =
  "https://script.google.com/macros/s/AKfycbwRabcxWmrjWwPDbByx7otDl_DyXq2CcyZeX77MWyBzljDtUm9WLRtuNkCYshPP42gD/exec";

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
        "Content-Type": "application/json",
      },
    });
    res.status(200).send("Данные получены");
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
