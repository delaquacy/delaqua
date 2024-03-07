import axios from "axios";
import { NextResponse } from "next/server";
const key =
  "sk_CAWFozjx49HzfPb05oju56ciYeaVc28IG8-fAgNO3oE_KyvdPGaSW3ysNZIDiCVB";

export async function POST(req: any, res: any) {
  const body = await req.json();
  const { webhookUrl, events } = body;
  try {
    const responses = [];
    for (const event of events) {
      const response = await axios.post(
        "https://sandbox-merchant.revolut.com/api/1.0/webhooks",
        {
          url: webhookUrl,
          events: [event],
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
      responses.push(response.data);
    }

    console.log(responses);

    return NextResponse.json(responses);
  } catch (error: any) {
    console.error("Ошибка при создании webhook:", error.response);
    return NextResponse.json({
      error: `Ошибка на сервере при создании webhook ${error}`,
    });
  }
}
