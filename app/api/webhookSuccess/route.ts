import axios from "axios";
import { NextResponse } from "next/server";
const key = process.env.REVOLUT_KEY;

export async function POST(req: any, res: any) {
  const body = await req.json();
  const { webhookUrl, events } = body;

  try {
    const response = await axios.post(
      "https://sandbox-merchant.revolut.com/api/1.0/webhooks",
      {
        url: webhookUrl,
        events: events,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",

          Authorization: `Bearer ${key}`,
        },
        maxBodyLength: Infinity,
      }
    );
    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({
      error: `Ошибка на сервере при создании webhook ${error}`,
    });
  }
}
