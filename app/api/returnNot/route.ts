import { db } from "@/app/lib/config";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const link =
  "https://script.google.com/macros/s/AKfycbz2IdNKqrkMPE9c7SFnBRp4A-rqP2MLIlaHqjabq_yf_1muCtol5nzWLtKSj6MmdNddjQ/exec";

export async function POST(
  req: NextRequest,
  res: NextApiResponse<string>
) {
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
    const paymentRef = doc(db, `payments/${eventData.order_id}`);
    await updateDoc(paymentRef, { paymentStatus: eventData.event });

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
