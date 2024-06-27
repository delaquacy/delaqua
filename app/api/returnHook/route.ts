import { db } from "@/app/lib/config";
import axios from "axios";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const link = process.env.NEXT_PUBLIC_PAYMENT_SHEET_LINK as string;

export async function POST(req: NextRequest, res: NextApiResponse<string>) {
  const now = new Date();
  now.setHours(now.getHours() + 3);
  const formattedDateTime = now
    .toISOString()
    .replace("T", " ")
    .substring(0, 19);

  try {
    const eventData = await req.json();
    const tableEvents = [
      "ORDER_COMPLETED",
      "ORDER_CANCELLED",
      "ORDER_PAYMENT_DECLINED",
      "ORDER_PAYMENT_FAILED",
    ];
    if (tableEvents.includes(eventData.event)) {
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
    }

    const paymentRef = doc(db, `payments/${eventData.order_id}`);
    await updateDoc(paymentRef, {
      paymentStatus: arrayUnion(eventData.event),
    });

    const response = NextResponse.json(
      {
        message: "Success",
      },
      {
        status: 200,
      }
    );

    return response;
  } catch (error) {
    console.log("Ошибка при обработке запроса:", error);
  }
}
