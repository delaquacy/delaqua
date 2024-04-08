import { db } from "@/app/lib/config";
import axios from "axios";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const link =
  "https://script.google.com/macros/s/AKfycbzEentV0YD4nSimcQH9K1bBDacAC4I5lXqxyYuNR4u6dozcGrwkNVg406r9QOLHKr6cvA/exec";

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
